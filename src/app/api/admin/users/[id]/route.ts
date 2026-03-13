import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Url from "@/models/Url";
import bcrypt from "bcryptjs";

// PATCH /api/admin/users/[id] — update user (name, email, password, role)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { name, email, password, role } = body;

    await dbConnect();

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update fields if provided
    if (name !== undefined) {
      if (!name.trim()) {
        return NextResponse.json(
          { error: "Name cannot be empty" },
          { status: 400 }
        );
      }
      user.name = name.trim();
    }

    if (email !== undefined) {
      const normalizedEmail = email.toLowerCase().trim();
      if (!normalizedEmail) {
        return NextResponse.json(
          { error: "Email cannot be empty" },
          { status: 400 }
        );
      }
      // Check for duplicate email (exclude current user)
      const existing = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: id },
      });
      if (existing) {
        return NextResponse.json(
          { error: "Email already in use by another account" },
          { status: 409 }
        );
      }
      user.email = normalizedEmail;
    }

    if (password !== undefined) {
      if (password.length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters" },
          { status: 400 }
        );
      }
      user.hashedPassword = await bcrypt.hash(password, 12);
    }

    if (role !== undefined) {
      if (!["user", "admin"].includes(role)) {
        return NextResponse.json(
          { error: "Role must be 'user' or 'admin'" },
          { status: 400 }
        );
      }
      // Prevent admin from demoting themselves
      if (user._id.toString() === session.user.id && role !== "admin") {
        return NextResponse.json(
          { error: "You cannot remove your own admin role" },
          { status: 400 }
        );
      }
      user.role = role;
    }

    await user.save();

    return NextResponse.json({
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Admin update user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[id] — delete user and all their URLs
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    // Prevent admin from deleting themselves
    if (id === session.user.id) {
      return NextResponse.json(
        { error: "You cannot delete your own account" },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete all URLs owned by this user
    await Url.deleteMany({ userId: id });

    // Delete the user
    await User.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin delete user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
