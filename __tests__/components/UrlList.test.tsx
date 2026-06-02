import { render, screen } from "@testing-library/react";
import UrlList from "@/components/UrlList";

jest.mock("next/link", () => {
  return function MockLink({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) {
    return <a href={href} {...props}>{children}</a>;
  };
});

jest.mock("@/hooks/useCopyToClipboard", () => ({
  useCopyToClipboard: () => ({
    isCopied: false,
    copyToClipboard: jest.fn().mockResolvedValue(true),
  }),
}));

const mockUrls = [
  {
    code: "abc1234",
    originalUrl: "https://example.com/very/long/url",
    shortUrl: "http://localhost:3000/abc1234",
    clicks: 12,
    favorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    code: "xyz9876",
    originalUrl: "https://another.com",
    shortUrl: "http://localhost:3000/xyz9876",
    clicks: 0,
    favorite: true,
    createdAt: new Date().toISOString(),
  },
];

describe("UrlList", () => {
  it("shows empty state when no URLs are provided", () => {
    render(
      <UrlList urls={[]} onUrlDeleted={jest.fn()} onFavoriteChanged={jest.fn()} />
    );
    expect(screen.getByText("No links yet")).toBeInTheDocument();
  });

  it("renders the original URL for each item", () => {
    render(
      <UrlList
        urls={mockUrls}
        onUrlDeleted={jest.fn()}
        onFavoriteChanged={jest.fn()}
      />
    );
    expect(screen.getByText("https://example.com/very/long/url")).toBeInTheDocument();
    expect(screen.getByText("https://another.com")).toBeInTheDocument();
  });

  it("renders the click count for each URL", () => {
    render(
      <UrlList
        urls={mockUrls}
        onUrlDeleted={jest.fn()}
        onFavoriteChanged={jest.fn()}
      />
    );
    expect(screen.getByText("12 clicks")).toBeInTheDocument();
    expect(screen.getByText("0 clicks")).toBeInTheDocument();
  });

  it("renders copy and delete buttons for each URL", () => {
    render(
      <UrlList
        urls={mockUrls}
        onUrlDeleted={jest.fn()}
        onFavoriteChanged={jest.fn()}
      />
    );
    const copyButtons = screen.getAllByText("Copy");
    const deleteButtons = screen.getAllByTitle("Delete link");
    expect(copyButtons).toHaveLength(2);
    expect(deleteButtons).toHaveLength(2);
  });

  it("renders analytics link pointing to /urls/[code]", () => {
    render(
      <UrlList
        urls={mockUrls}
        onUrlDeleted={jest.fn()}
        onFavoriteChanged={jest.fn()}
      />
    );
    const analyticsLinks = screen.getAllByTitle("View analytics");
    expect(analyticsLinks[0]).toHaveAttribute("href", "/urls/abc1234");
  });
});
