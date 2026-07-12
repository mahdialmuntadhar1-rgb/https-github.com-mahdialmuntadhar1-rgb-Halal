import React from "react";

export default function Header() {
  return (
    <header className="bg-[#8B4513] text-white p-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold">Zawaj Halal</h1>
        <nav className="space-x-4">
          <a href="/" className="hover:text-[#D2691E]">Home</a>
          <a href="/login" className="hover:text-[#D2691E]">Login</a>
        </nav>
      </div>
    </header>
  );
}
