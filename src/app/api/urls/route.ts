import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Url from "@/models/Url";
import { generateShortCode, isValidUrl } from "@/lib/utils";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const urls = await Url.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ urls });
  } catch (error) {
    console.error("Error fetching URLs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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

    // Generate unique short code
    let code: string;
    let exists = true;

    do {
      code = generateShortCode();
      exists = !!(await Url.findOne({ code }));
    } while (exists);

    const newUrl = await Url.create({
      code,
      originalUrl: url,
      userId: session.user.id,
    });

    return NextResponse.json(
      {
        url: {
          id: newUrl._id.toString(),
          code: newUrl.code,
          originalUrl: newUrl.originalUrl,
          shortUrl: `${process.env.NEXT_PUBLIC_APP_URL}/${newUrl.code}`,
          createdAt: newUrl.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating URL:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "URL ID is required" }, { status: 400 });
    }

    await dbConnect();

    const url = await Url.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!url) {
      return NextResponse.json({ error: "URL not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting URL:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
