import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t py-6 mt-12 bg-white">
      <div className="container mx-auto px-4 text-center text-sm text-gray-600">
        <p>&copy; {new Date().getFullYear()} Next URL Shortener. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2">
          <Link href="/products" className="hover:text-black">Products</Link>
          <Link href="/about" className="hover:text-black">About</Link>
          <Link href="/contact" className="hover:text-black">Contact</Link>
          <Link href="/faq" className="hover:text-black">FAQ</Link>
        </div>
      </div>
    </footer>
  );
}
