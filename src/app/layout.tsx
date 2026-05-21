import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";

import { ToastProvider } from "@/components/ToastContext";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Shorty URL Shortener",
  description: "A Next.js URL shortener with authentication, admin tools, products, and favorites.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="min-h-screen flex flex-col bg-gray-50 font-sans antialiased"
      >
        <Providers>
          <ToastProvider>
            <Navbar />
            <main className="container mx-auto px-4 py-8 flex-1">{children}</main>
            <Footer />
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
