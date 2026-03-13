import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Url from "@/models/Url";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    // Skip NextAuth and API routes
    if (code === "api" || code === "auth" || code === "dashboard" || code === "_next") {
      return NextResponse.next();
    }

    await dbConnect();

    const url = await Url.findOne({ code });

    if (!url) {
      return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
    }

    return NextResponse.redirect(url.originalUrl);
  } catch (error) {
    console.error("Redirect error:", error);
    return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  }
}
