"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-[#0dda69] via-[#0edb78] to-[#3bc6ed] text-white mt-20">
      <div className="border-t border-white/20 py-10 text-center text-sm space-y-6 container mx-auto flex flex-col items-center">
        {/* Logo */}
        <div className="flex items-center justify-center">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logos/app-logo.png"
              alt="Settleup Logo"
              width={200}
              height={60}
              className="h-15 w-auto object-contain"
            />
            <span className="relative text-3xl font-bold transition duration-300 hover:text-black group">
              <span className="relative z-10 px-2 py-1">Settleup</span>
            </span>
          </Link>
        </div>

        {/* Social icons */}
        <div className="flex justify-center space-x-6">
          <Link
            href="https://instagram.com"
            target="_blank"
            aria-label="Instagram"
          >
            <Instagram className="h-5 w-5 hover:text-pink-400 transition-colors duration-200" />
          </Link>
          <Link href="https://twitter.com" target="_blank" aria-label="Twitter">
            <Twitter className="h-5 w-5 hover:text-black transition-colors duration-200" />
          </Link>
          <Link
            href="https://linkedin.com"
            target="_blank"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-5 w-5 hover:text-blue-700 transition-colors duration-200" />
          </Link>
        </div>

        {/* Footer note */}
        <p className="text-sm opacity-100 mt-8">
          Made with ❤️ by Arijit. © {new Date().getFullYear()} All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
