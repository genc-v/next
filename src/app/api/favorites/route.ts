import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Favorite from "@/models/Favorite";

async function readFavoritePayload(req: Request) {
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return req.json();
  }

  const formData = await req.formData();
  return {
    productSlug: formData.get("productSlug"),
    productName: formData.get("productName"),
  };
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const favorites = await Favorite.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      favorites: favorites.map((favorite) => ({
        _id: favorite._id.toString(),
        productSlug: favorite.productSlug,
        productName: favorite.productName,
        createdAt: favorite.createdAt,
      })),
    });
  } catch (error) {
    console.error("Favorites GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  const { productSlug, productName } = await readFavoritePayload(req);
  if (!productSlug || !productName) {
    return NextResponse.json(
      { error: "Product slug and name are required" },
      { status: 400 }
    );
  }

  await dbConnect();
  await Favorite.findOneAndUpdate(
    { userId: session.user.id, productSlug },
    { userId: session.user.id, productSlug, productName },
    { upsert: true, new: true }
  );

  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    return NextResponse.redirect(new URL("/favorites", req.url));
  }

  return NextResponse.json({ success: true }, { status: 201 });
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const productSlug = searchParams.get("productSlug");
    if (!productSlug) {
      return NextResponse.json({ error: "Product slug is required" }, { status: 400 });
    }

    await dbConnect();
    await Favorite.deleteOne({ userId: session.user.id, productSlug });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Favorites DELETE error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
