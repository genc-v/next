import { NextResponse } from "next/server";
import type { PipelineStage } from "mongoose";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";

// GET /api/admin/urls?search=&page=1&limit=10
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    // Use aggregation to unwind links and search through them
    const pipeline: PipelineStage[] = [
      { $unwind: "$links" }
    ];

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { "links.code": { $regex: search, $options: "i" } },
            { "links.originalUrl": { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { name: { $regex: search, $options: "i" } },
          ]
        }
      });
    }

    // Count pipeline
    const countPipeline = [...pipeline, { $count: "total" }];
    const countResult = await User.aggregate(countPipeline);
    const total = countResult.length > 0 ? countResult[0].total : 0;

    // Data pipeline
    pipeline.push(
      { $sort: { "links.createdAt": -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          userName: "$name",
          userEmail: "$email",
          code: "$links.code",
          originalUrl: "$links.originalUrl",
          clicks: "$links.clicks",
          favorite: "$links.favorite",
          createdAt: "$links.createdAt",
          updatedAt: "$links.updatedAt"
        }
      }
    );

    const urls = await User.aggregate(pipeline);

    const formatted = urls.map((url) => ({
      ...url,
      userId: {
        _id: url.userId.toString(),
        name: url.userName,
        email: url.userEmail,
      },
    }));

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
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/urls?id=xxx — delete any URL by code
export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { error: "URL code is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findOneAndUpdate(
      { "links.code": code },
      { $pull: { links: { code } } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "URL not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin delete url error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
