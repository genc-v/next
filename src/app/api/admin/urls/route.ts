import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Url from "@/models/Url";
import User from "@/models/User";

// GET /api/admin/urls?search=&page=1&limit=10
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));
    const skip = (page - 1) * limit;

    await dbConnect();

    // Ensure User model is registered before populating
    void User;

    // Build filter — search by code, originalUrl, or owner email/name
    let filter = {};

    if (search) {
      // First find matching user IDs
      const matchingUsers = await User.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      })
        .select("_id")
        .lean();

      const matchingUserIds = matchingUsers.map((u) => u._id);

      filter = {
        $or: [
          { code: { $regex: search, $options: "i" } },
          { originalUrl: { $regex: search, $options: "i" } },
          { userId: { $in: matchingUserIds } },
        ],
      };
    }

    const [urls, total] = await Promise.all([
      Url.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("userId", "name email")
        .lean(),
      Url.countDocuments(filter),
    ]);

    const formatted = urls.map((url) => {
      const owner = url.userId as unknown as
        | { _id: { toString(): string }; name: string; email: string }
        | null;

      return {
        ...url,
        _id: url._id.toString(),
        userId:
          owner && typeof owner === "object" && "email" in owner
            ? {
                _id: owner._id.toString(),
                name: owner.name,
                email: owner.email,
              }
            : url.userId?.toString(),
      };
    });

    return NextResponse.json({
      urls: formatted,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Admin urls error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/urls?id=xxx — delete any URL by ID
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "URL ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const url = await Url.findByIdAndDelete(id);

    if (!url) {
      return NextResponse.json({ error: "URL not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin delete url error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
