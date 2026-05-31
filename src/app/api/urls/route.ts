import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { generateShortCode, isValidUrl } from "@/lib/utils";

// GET /api/urls — fetch URLs for the logged-in user (paginated)
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const favoriteOnly = searchParams.get("favorite") === "true";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));
    const skip = (page - 1) * limit;

    // Sort by creation date (newest first), then paginate
    const sortedLinks = [...user.links]
      .filter((link) => !favoriteOnly || link.favorite)
      .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    const totalFiltered = sortedLinks.length;
    const totalPages = Math.ceil(totalFiltered / limit);
    const paginatedLinks = sortedLinks.slice(skip, skip + limit);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const urls = paginatedLinks.map((link) => ({
      code: link.code,
      originalUrl: link.originalUrl,
      shortUrl: `${appUrl}/${link.code}`,
      clicks: link.clicks || 0,
      favorite: !!link.favorite,
      createdAt: link.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: link.updatedAt?.toISOString() || new Date().toISOString(),
    }));

    const totalClicks = user.links.reduce((sum, link) => sum + (link.clicks || 0), 0);
    const favoriteCount = user.links.filter((link) => link.favorite).length;

    return NextResponse.json({
      urls,
      totalUrls: totalFiltered,
      totalClicks,
      favoriteCount,
      page,
      limit,
      totalPages,
      hasMore: page < totalPages,
    });
  } catch (error) {
    console.error("Error fetching URLs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST /api/urls — create a new shortened URL
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url } = await req.json();

    if (!url || !isValidUrl(url)) {
      return NextResponse.json(
        { error: "A valid URL is required (must start with http:// or https://)" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Generate a unique 6-character code
    let code = "";
    let exists = true;
    while (exists) {
      code = generateShortCode();
      const userWithCode = await User.findOne({ "links.code": code });
      exists = !!userWithCode;
    }

    const newLink = {
      code,
      originalUrl: url,
      clicks: 0,
      favorite: false,
    };

    const user = await User.findByIdAndUpdate(
      session.user.id,
      {
        $push: { links: newLink }
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const createdLink = user.links.find((l) => l.code === code);

    return NextResponse.json(
      {
        url: {
          code: createdLink?.code,
          originalUrl: createdLink?.originalUrl,
          shortUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/${createdLink?.code}`,
          clicks: createdLink?.clicks || 0,
          favorite: !!createdLink?.favorite,
          createdAt: createdLink?.createdAt,
          updatedAt: createdLink?.updatedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating URL:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PATCH /api/urls — update a specific URL by code for the logged-in user
export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code, url, favorite } = await req.json();
    if (!code) {
      return NextResponse.json(
        { error: "URL code is required" },
        { status: 400 }
      );
    }

    if (url && !isValidUrl(url)) {
      return NextResponse.json(
        { error: "A valid destination URL is required" },
        { status: 400 }
      );
    }

    const updates: Record<string, string | boolean> = {};
    if (url) updates["links.$.originalUrl"] = url;
    if (typeof favorite === "boolean") updates["links.$.favorite"] = favorite;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No URL updates were provided" },
        { status: 400 }
      );
    }

    await dbConnect();
    const user = await User.findOneAndUpdate(
      { _id: session.user.id, "links.code": code },
      { $set: updates },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "URL not found" }, { status: 404 });
    }

    const updatedLink = user.links.find((link) => link.code === code);
    return NextResponse.json({ url: updatedLink });
  } catch (error) {
    console.error("Error updating URL:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE /api/urls?code=xxx — delete a specific URL by code for the logged-in user
export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    // Changing to delete by code because we removed ids
    const code = searchParams.get("code") || searchParams.get("id");

    if (!code) {
      return NextResponse.json({ error: "URL code is required" }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOneAndUpdate(
      { _id: session.user.id, "links.code": code },
      { $pull: { links: { code } } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "URL not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting URL:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
