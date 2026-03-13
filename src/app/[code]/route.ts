import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    // Skip NextAuth and API routes
    if (code === "api" || code === "auth" || code === "dashboard" || code === "_next" || code === "admin") {
      return NextResponse.next();
    }

    await dbConnect();

    // Find the user containing this link
    const user = await User.findOne(
      { "links.code": code },
      { "links.$": 1 }
    );

    if (!user || !user.links || user.links.length === 0) {
      // Redirect to home if code is not found
      return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
    }

    const link = user.links[0];
    
    // Redirect to the original URL
    return NextResponse.redirect(link.originalUrl);
  } catch (error) {
    console.error("Error redirecting:", error);
    return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  }
}
