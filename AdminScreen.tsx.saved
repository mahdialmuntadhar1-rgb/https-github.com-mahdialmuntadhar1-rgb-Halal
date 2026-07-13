import React, { useState, useEffect } from 'react';
import { Shield, Image, Save, ArrowLeft, Upload, Check } from 'lucide-react';

const ADMIN_PASSWORD = 'halal2024'; // Change this to your password

export default function AdminScreen() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [heroImage, setHeroImage] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [saved, setSaved] = useState(false);

  // Load current settings
  useEffect(() => {
    const savedHero = localStorage.getItem('admin_hero_image');
    const savedTitle = localStorage.getItem('admin_hero_title');
    if (savedHero) setHeroImage(savedHero);
    if (savedTitle) setHeroTitle(savedTitle);
  }, []);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
    } else {
      alert('Wrong password!');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeroImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    localStorage.setItem('admin_hero_image', heroImage);
    localStorage.setItem('admin_hero_title', heroTitle);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#8B4513] to-[#5D2E0C] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-[#8B4513]" />
            <h1 className="text-2xl font-bold text-[#2A2A2A]">Admin Panel</h1>
          </div>
          <p className="text-gray-600 mb-4">Enter password to access admin controls</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-4 focus:border-[#8B4513] focus:outline-none"
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button
            onClick={handleLogin}
            className="w-full py-3 bg-gradient-to-r from-[#8B4513] to-[#D2691E] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Login
          </button>
          <a href="/" className="block text-center mt-4 text-[#8B4513] hover:underline">
            ← Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-[#8B4513] text-white p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6" />
            <span className="text-xl font-bold">Admin Panel</span>
          </div>
          <a href="/" className="flex items-center gap-2 hover:text-[#D2691E] transition">
            <ArrowLeft className="w-5 h-5" />
            Back to Site
          </a>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Image className="w-6 h-6 text-[#8B4513]" />
          Hero Section Editor
        </h2>

        {/* Hero Image Upload */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Hero Image</h3>
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2 px-4 py-2 bg-[#8B4513] text-white rounded-lg cursor-pointer hover:bg-[#5D2E0C] transition">
              <Upload className="w-5 h-5" />
              Upload Image
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
            {heroImage && <span className="text-green-600 flex items-center gap-1"><Check className="w-4 h-4" /> Image loaded</span>}
          </div>
          {heroImage && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Preview:</p>
              <img src={heroImage} alt="Hero preview" className="w-full max-w-md h-48 object-cover rounded-xl" />
            </div>
          )}
        </div>

        {/* Hero Title */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Hero Title</h3>
          <input
            type="text"
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            placeholder="Enter hero title..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#8B4513] focus:outline-none"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#8B4513] to-[#D2691E] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          <Save className="w-5 h-5" />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
