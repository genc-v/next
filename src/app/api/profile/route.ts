import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    await dbConnect();

    // Password change
    if (body.currentPassword !== undefined || body.newPassword !== undefined) {
      const { currentPassword, newPassword } = body;

      if (!currentPassword || !newPassword) {
        return NextResponse.json(
          { error: "Current password and new password are required" },
          { status: 400 }
        );
      }
      if (String(newPassword).length < 6) {
        return NextResponse.json(
          { error: "New password must be at least 6 characters" },
          { status: 400 }
        );
      }

      const user = await User.findById(session.user.id);
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      if (!user.hashedPassword) {
        return NextResponse.json(
          { error: "Password change is not available for accounts signed in with Google" },
          { status: 400 }
        );
      }

      const valid = await bcrypt.compare(String(currentPassword), user.hashedPassword);
      if (!valid) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
      }

      user.hashedPassword = await bcrypt.hash(String(newPassword), 12);
      await user.save();

      return NextResponse.json({ success: true });
    }

    // Name update
    const { name } = body;
    if (!name || String(name).trim().length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters" },
        { status: 400 }
      );
    }

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { name: String(name).trim() },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
