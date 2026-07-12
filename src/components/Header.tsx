import React from "react";
import { LogIn, Menu, X } from "lucide-react";

interface HeaderProps {
  onToggleMenu?: () => void;
  isMenuOpen?: boolean;
}

export default function Header({ onToggleMenu, isMenuOpen }: HeaderProps) {
  return (
    <header className="bg-[#8B4513] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4a574] to-[#c49a6c] flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">H</span>
          </div>
          <span className="text-xl font-bold tracking-tight">HALAL</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="/" className="hover:text-[#D2691E] transition">Home</a>
          <a href="/explore" className="hover:text-[#D2691E] transition">Explore</a>
          <a href="/login" className="hover:text-[#D2691E] transition">Login</a>
        </nav>

        {/* Mobile menu button */}
        <button 
          onClick={onToggleMenu} 
          className="md:hidden p-2 rounded-lg hover:bg-[#5D2E0C] transition"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Login button (desktop) */}
        <a 
          href="/login" 
          className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#d4a574] to-[#c49a6c] text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
        >
          <LogIn className="w-4 h-4" />
          <span>Login</span>
        </a>
      </div>
    </header>
  );
}
