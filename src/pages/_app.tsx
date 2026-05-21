import type { AppProps } from "next/app";
import "@/app/globals.css";
import Providers from "@/components/Providers";
import { ToastProvider } from "@/components/ToastContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <ToastProvider>
        <div className="min-h-screen bg-gray-50 text-gray-900">
          <Navbar />
          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Component {...pageProps} />
          </main>
          <Footer />
        </div>
      </ToastProvider>
    </Providers>
  );
}
