export default function Footer() {
  return (
    <footer className="border-t py-6 mt-12 bg-white">
      <div className="container mx-auto px-4 text-center text-sm text-gray-600">
        <p>&copy; {new Date().getFullYear()} Next URL Shortener. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="/about" className="hover:text-black">About</a>
          <a href="/contact" className="hover:text-black">Contact</a>
          <a href="/faq" className="hover:text-black">FAQ</a>
        </div>
      </div>
    </footer>
  );
}
