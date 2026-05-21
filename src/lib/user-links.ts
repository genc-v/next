import User from "@/models/User";

export type SerializedLink = {
  code: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UserLinkSummary = {
  urls: SerializedLink[];
  totalUrls: number;
  totalClicks: number;
  favoriteCount: number;
};

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function getUserLinkSummary(
  userId: string,
  options: { favoriteOnly?: boolean } = {}
): Promise<UserLinkSummary> {
  const user = await User.findById(userId);

  if (!user) {
    return { urls: [], totalUrls: 0, totalClicks: 0, favoriteCount: 0 };
  }

  const allLinks = [...user.links];
  const visibleLinks = allLinks
    .filter((link) => !options.favoriteOnly || link.favorite)
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

  return {
    urls: visibleLinks.map((link) => ({
      code: link.code,
      originalUrl: link.originalUrl,
      shortUrl: `${appUrl}/${link.code}`,
      clicks: link.clicks || 0,
      favorite: !!link.favorite,
      createdAt: link.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: link.updatedAt?.toISOString() || new Date().toISOString(),
    })),
    totalUrls: allLinks.length,
    totalClicks: allLinks.reduce((sum, link) => sum + (link.clicks || 0), 0),
    favoriteCount: allLinks.filter((link) => link.favorite).length,
  };
}
