import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { generateShortCode, isValidUrl } from "@/lib/utils";

// GET /api/urls — fetch all URLs for the logged-in user
export async function GET() {
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

    // Return the URLs sorted by creation date (newest first)
    const urls = [...user.links].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    return NextResponse.json({ urls });
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
          createdAt: createdLink?.createdAt,
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

    const { code, url } = await req.json();
    if (!code || !url || !isValidUrl(url)) {
      return NextResponse.json(
        { error: "A URL code and valid destination URL are required" },
        { status: 400 }
      );
    }

    await dbConnect();
    const user = await User.findOneAndUpdate(
      { _id: session.user.id, "links.code": code },
      { $set: { "links.$.originalUrl": url } },
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
