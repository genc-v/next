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
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
};

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function getUserLinkSummary(
  userId: string,
  options: { favoriteOnly?: boolean; page?: number; limit?: number } = {}
): Promise<UserLinkSummary> {
  const user = await User.findById(userId);

  if (!user) {
    return { urls: [], totalUrls: 0, totalClicks: 0, favoriteCount: 0, page: 1, limit: 10, totalPages: 0, hasMore: false };
  }

  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  const allLinks = [...user.links];
  const sortedLinks = allLinks
    .filter((link) => !options.favoriteOnly || link.favorite)
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

  const totalFiltered = sortedLinks.length;
  const totalPages = Math.ceil(totalFiltered / limit);
  const paginatedLinks = sortedLinks.slice(skip, skip + limit);

  return {
    urls: paginatedLinks.map((link) => ({
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
    page,
    limit,
    totalPages,
    hasMore: page < totalPages,
  };
}
