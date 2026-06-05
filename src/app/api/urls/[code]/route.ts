import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { code } = await params;
  await dbConnect();

  const user = await User.findOne(
    { "links.code": code },
    { _id: 1, "links.$": 1 }
  );

  if (!user) {
    return NextResponse.json({ error: "URL not found" }, { status: 404 });
  }

  const isAdmin = session.user.role === "admin";
  if (!isAdmin && user._id.toString() !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const link = user.links[0];
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return NextResponse.json({
    code: link.code,
    originalUrl: link.originalUrl,
    shortUrl: `${appUrl}/${link.code}`,
    clicks: link.clicks,
    favorite: link.favorite,
    createdAt: link.createdAt?.toISOString(),
    updatedAt: link.updatedAt?.toISOString(),
  });
}
