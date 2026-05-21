"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { Menu, X, LayoutDashboard, Shield, User, LogOut, ChevronDown, Link as LinkIcon, Info, Mail, HelpCircle, Heart } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "Home", href: "/", icon: <LinkIcon size={18} /> },
    { name: "About", href: "/about", icon: <Info size={18} /> },
    { name: "Contact", href: "/contact", icon: <Mail size={18} /> },
    { name: "FAQ", href: "/faq", icon: <HelpCircle size={18} /> },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-900 transition-opacity hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white">
              <LinkIcon size={18} strokeWidth={3} />
            </div>
            Shorty
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-black ${
                  pathname === link.href ? "text-black" : "text-gray-500"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex md:items-center md:gap-4">
            {status === "loading" ? (
              <div className="h-9 w-24 animate-pulse rounded-md bg-gray-200" />
            ) : session?.user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-white p-1 pr-3 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                    <User size={16} />
                  </div>
                  <span className="max-w-[120px] truncate">{session.user.name || session.user.email?.split('@')[0]}</span>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-gray-200 bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="border-b border-gray-100 px-4 py-3">
                      <p className="truncate text-sm font-medium text-gray-900">{session.user.name}</p>
                      <p className="truncate text-xs text-gray-500">{session.user.email}</p>
                    </div>
                    
                    <div className="py-1">
                      <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black" onClick={() => setIsDropdownOpen(false)}>
                        <LayoutDashboard size={16} />
                        Dashboard
                      </Link>
                      <Link href="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black" onClick={() => setIsDropdownOpen(false)}>
                        <User size={16} />
                        Profile Settings
                      </Link>
                      <Link href="/favorites" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black" onClick={() => setIsDropdownOpen(false)}>
                        <Heart size={16} />
                        Favorites
                      </Link>
                      {session.user.role === "admin" && (
                        <Link href="/admin" className="flex items-center gap-3 px-4 py-2 text-sm text-purple-700 hover:bg-purple-50" onClick={() => setIsDropdownOpen(false)}>
                          <Shield size={16} />
                          Admin Panel
                        </Link>
                      )}
                    </div>
                    
                    <div className="border-t border-gray-100 py-1">
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/signin"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-800"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-b border-gray-200 bg-white md:hidden shadow-lg">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-base font-medium ${
                  pathname === link.href ? "bg-gray-50 text-black" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="border-t border-gray-200 pb-4 pt-4">
            {status === "loading" ? (
              <div className="px-4"><div className="h-10 w-full animate-pulse rounded bg-gray-100" /></div>
            ) : session?.user ? (
              <>
                <div className="mb-3 px-5">
                  <p className="text-base font-medium text-gray-900">{session.user.name}</p>
                  <p className="text-sm font-medium text-gray-500">{session.user.email}</p>
                </div>
                <div className="space-y-1 px-2">
                  <Link href="/dashboard" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-black">
                    <LayoutDashboard size={18} /> Dashboard
                  </Link>
                  <Link href="/profile" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-black">
                    <User size={18} /> Profile Settings
                  </Link>
                  <Link href="/favorites" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-black">
                    <Heart size={18} /> Favorites
                  </Link>
                  {session.user.role === "admin" && (
                    <Link href="/admin" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-base font-medium text-purple-700 hover:bg-purple-50">
                      <Shield size={18} /> Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-base font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={18} /> Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 px-4">
                <Link
                  href="/auth/signin"
                  className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/signup"
                  className="flex items-center justify-center rounded-md border border-transparent bg-black px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-gray-800"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
