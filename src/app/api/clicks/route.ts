import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Click from "@/models/Click";
import User from "@/models/User";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "code is required" }, { status: 400 });
  }

  await dbConnect();

  const owner = await User.findOne({ "links.code": code }, { _id: 1 });
  if (!owner) {
    return NextResponse.json({ error: "URL not found" }, { status: 404 });
  }

  const isAdmin = session.user.role === "admin";
  if (!isAdmin && owner._id.toString() !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const filter: Record<string, unknown> = { urlCode: code };

  const device = searchParams.get("device");
  if (device && device !== "all") filter.device = device;

  const os = searchParams.get("os");
  if (os && os !== "all") filter.os = os;

  const browser = searchParams.get("browser");
  if (browser && browser !== "all") filter.browser = browser;

  const from = searchParams.get("from");
  const to = searchParams.get("to");
  if (from || to) {
    const timeFilter: { $gte?: Date; $lte?: Date } = {};
    if (from) timeFilter.$gte = new Date(from);
    if (to) timeFilter.$lte = new Date(to + "T23:59:59.999Z");
    filter.timestamp = timeFilter;
  }

  const clicks = await Click.find(filter).sort({ timestamp: -1 }).limit(500);

  const byDevice: Record<string, number> = {};
  const byOS: Record<string, number> = {};
  const byBrowser: Record<string, number> = {};

  for (const c of clicks) {
    byDevice[c.device] = (byDevice[c.device] || 0) + 1;
    byOS[c.os] = (byOS[c.os] || 0) + 1;
    byBrowser[c.browser] = (byBrowser[c.browser] || 0) + 1;
  }

  const totalAll = await Click.countDocuments({ urlCode: code });

  return NextResponse.json({
    clicks: clicks.map((c) => ({
      _id: c._id.toString(),
      timestamp: c.timestamp.toISOString(),
      device: c.device,
      os: c.os,
      browser: c.browser,
      referrer: c.referrer,
      ip: c.ip,
    })),
    total: clicks.length,
    totalAll,
    byDevice,
    byOS,
    byBrowser,
  });
}
