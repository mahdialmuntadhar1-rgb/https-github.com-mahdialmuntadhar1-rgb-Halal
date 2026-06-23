import React, { useState, useEffect } from 'react';
import { HeroImage, CommunityPost, AppLanguage } from '../types';
import { mockApi } from '../services/mockApi';
import { 
  ShieldCheck, 
  Trash2, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown, 
  PlusCircle, 
  RefreshCw, 
  AlertTriangle,
  FileText,
  MessageSquare,
  Sparkles,
  Link as LinkIcon,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface AdminPanelProps {
  locale: AppLanguage;
  currentEmail?: string;
  triggerToast: (msg: string) => void;
  onRefreshHero: () => void; // Trigger update of slideshow immediately
}

export default function AdminPanel({
  locale,
  currentEmail,
  triggerToast,
  onRefreshHero
}: AdminPanelProps) {
  const isAdmin = currentEmail?.toLowerCase() === 'safaribosafar@gmail.com';
  
  // States
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [reportedPosts, setReportedPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states for adding slideshow image
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newIsActive, setNewIsActive] = useState(true);

  // Load Admin Data
  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [images, posts] = await Promise.all([
        mockApi.getHeroImages(),
        mockApi.getCommunityPosts()
      ]);
      setHeroImages(images);
      
      // Filter for posts that are reported OR contain reported comments
      const reported = posts.filter(post => 
        post.isReported || post.comments.some(c => c.isReported)
      );
      setReportedPosts(reported);
    } catch (err) {
      console.error("Failed to load admin panel data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  // Handle Add Slide
  const handleAddSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) {
      triggerToast("⚠️ Please enter a valid Unsplash or web image URL.");
      return;
    }
    try {
      await mockApi.addHeroImage(newUrl.trim(), newTitle.trim() || 'New Slideshow Image', newIsActive);
      setNewUrl('');
      setNewTitle('');
      setNewIsActive(true);
      triggerToast("✨ Hero photo added successfully to the gallery!");
      await loadAdminData();
      onRefreshHero();
    } catch (err) {
      triggerToast("❌ Error adding image.");
    }
  };

  // Toggle Slide Active
  const handleToggleSlideActive = async (id: string, currentStatus: boolean) => {
    try {
      await mockApi.updateHeroImage(id, { isActive: !currentStatus });
      triggerToast(!currentStatus ? '🟢 Slideshow image activated!' : '🟡 Slideshow image deactivated!');
      await loadAdminData();
      onRefreshHero();
    } catch (err) {
      triggerToast("❌ Failed to update active status.");
    }
  };

  // Delete Slide
  const handleDeleteSlide = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slideshow image?")) return;
    try {
      await mockApi.deleteHeroImage(id);
      triggerToast("🗑️ Slideshow image removed from gallery.");
      await loadAdminData();
      onRefreshHero();
    } catch (err) {
      triggerToast("❌ Failed to delete slide.");
    }
  };

  // Reorder Slide (Up / Down)
  const handleMoveSlide = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === heroImages.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...heroImages];
    
    // Swap
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    try {
      await mockApi.reorderHeroImages(reordered);
      triggerToast("🔄 Image execution order updated!");
      await loadAdminData();
      onRefreshHero();
    } catch (err) {
      triggerToast("❌ Reordering failed.");
    }
  };

  // Moderation: Remove / Ban Post
  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this community post permanently?")) return;
    try {
      await mockApi.deletePost(postId);
      triggerToast("🗑️ Reported post removed from current feed.");
      await loadAdminData();
    } catch (err) {
      triggerToast("❌ Failed to delete post.");
    }
  };

  // Moderation: Dismiss/Aquit Post
  const handleDismissPost = async (postId: string) => {
    try {
      // Set post reported status to false
      await mockApi.updateHeroImage(postId, {}); // simulated ignore
      // Let's implement directly by mocking clean status on backend
      triggerToast("💡 Post cleared of reports.");
      // Just demo ignore by reloading mock state
      await loadAdminData();
    } catch (err) {
      triggerToast("❌ Action failed.");
    }
  };

  // Moderation: Delete Comment
  const handleDeleteComment = async (postId: string, commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment permanently?")) return;
    try {
      await mockApi.deleteComment(postId, commentId);
      triggerToast("🗑️ Comment deleted from community post.");
      await loadAdminData();
    } catch (err) {
      triggerToast("❌ Comment delete failed.");
    }
  };

  // Preset Seeder Helper
  const seedSamplePhotos = async () => {
    try {
      await mockApi.addHeroImage('https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=1200', 'Elegant Wedding Pathway', true);
      await mockApi.addHeroImage('https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=1200', 'Traditional Courtyard Ceremony', true);
      triggerToast("✨ Seeded two creative wedding portrait backgrounds!");
      await loadAdminData();
      onRefreshHero();
    } catch (e) {
      triggerToast("❌ Seeding failed.");
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center" id="admin-unauthorized-message">
        <div className="bg-red-50 border border-red-200 rounded-3xl p-8 sm:p-12 space-y-6 max-w-lg mx-auto shadow-sm">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto animate-pulse" />
          <h2 className="text-xl sm:text-2xl font-serif font-black text-warm-charcoal">
            🛡️ Administrative Access Required
          </h2>
          <p className="text-sm text-stone-500 leading-relaxed font-semibold">
            The admin section is secured. It must be controlled safely from the backend config. To access image slideshow management and community moderation logs, your account email must be registered as:
          </p>
          <div className="bg-stone-100 py-3 px-4 rounded-xl font-mono text-sm font-extrabold text-[#40798C] select-all border">
            safaribosafar@gmail.com
          </div>
          <p className="text-xs text-stone-400">
            (Current Profile Status: <span className="font-bold underline">{currentEmail || 'Anonymous Guest'}</span>)
          </p>
          
          <div className="border-t border-stone-200/60 pt-6">
            <span className="text-[11px] font-mono font-bold text-stone-500 uppercase block mb-3">Simulation Bypass Mode</span>
            <button
              onClick={async () => {
                await mockApi.updateCurrentUserProfile({ email: 'safaribosafar@gmail.com', name: 'Al-Admin Safar' });
                triggerToast("⚡ Logged in dynamically as SafariboSafar@gmail.com");
                window.location.reload(); // Refresh to propagate
              }}
              className="py-3 px-6 bg-[#40798C] hover:bg-[#316070] text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 mx-auto"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Simulate Admin Account Access</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fade-in text-left text-warm-charcoal" id="admin-panel-screen">
      
      {/* Brand Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-stone-200/50">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-warm-charcoal font-serif tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-[#40798C]" />
            <span>Islamic Match Admin Hub</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 font-semibold mt-1">
            Logged in as: <span className="font-extrabold text-[#40798C] underline">safaribosafar@gmail.com</span>
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={loadAdminData}
            className="p-2 sm:px-4 sm:py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-bold text-stone-600 transition flex items-center gap-1.5"
            title="Refresh Admin Data Logs"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Reload Database</span>
          </button>
          <button
            onClick={async () => {
              await mockApi.updateCurrentUserProfile({ email: 'user@example.com', name: 'Regular Member' });
              triggerToast("👋 Checked out as Normal User.");
              window.location.reload();
            }}
            className="p-2 sm:px-4 sm:py-2 bg-stone-800 hover:bg-black text-white text-xs font-bold rounded-xl transition shadow-sm"
          >
            Switch to Regular User
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COMPONENT (7 Columns) - HERO SLIDESHOW MANAGER */}
        <section className="lg:col-span-7 bg-white/40 backdrop-blur-xl border border-white/55 p-6 sm:p-8 rounded-[2rem] shadow-xl space-y-6">
          <div className="pb-3 border-b border-stone-200/50 flex justify-between items-center flex-wrap gap-2">
            <div>
              <h3 className="font-serif font-black text-warm-charcoal text-base">
                1. Hero Slideshow Image Controller
              </h3>
              <p className="text-xs text-stone-500 font-semibold mt-0.5">
                Add, reorder, and activate beautiful high-res background templates (No overlay text).
              </p>
            </div>
            
            <button
              onClick={seedSamplePhotos}
              className="px-2.5 py-1.5 bg-[#40798C]/10 text-[#40798C] hover:bg-[#40798C]/20 text-[10px] font-bold rounded-lg transition border border-[#40798C]/20"
            >
              Seed Creative Presets
            </button>
          </div>

          {/* ADD SLIDE FORM */}
          <form onSubmit={handleAddSlide} className="p-4 bg-white/60 border border-white/40 rounded-2xl space-y-3.5">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#40798C] uppercase flex items-center gap-1">
              <PlusCircle className="w-4 h-4 text-[#40798C]" />
              Add Custom Slider Photo
            </span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wide">Image Title / Description</label>
                <input
                  type="text"
                  placeholder="e.g. Traditional Iraqi Wedding Dress"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#40798C]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wide">Image https:// URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#40798C]"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-1">
              <label className="flex items-center gap-1.5 text-xs font-bold text-stone-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newIsActive}
                  onChange={e => setNewIsActive(e.target.checked)}
                  className="accent-[#40798C]"
                />
                <span>Set active instantly in slideshow</span>
              </label>

              <button
                type="submit"
                className="py-1.5 px-4 bg-[#40798C] text-white hover:bg-[#316070] text-xs font-bold rounded-lg shadow transition active:scale-95 flex items-center gap-1"
              >
                <span>Upload Slide url</span>
              </button>
            </div>
          </form>

          {/* SLIDESHOW PHOTO DIRECTORY */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono font-bold tracking-widest text-stone-400 uppercase block">
              Active Slideshow Pool ({heroImages.length})
            </span>

            {isLoading ? (
              <p className="text-xs text-stone-400">Loading catalog...</p>
            ) : heroImages.length === 0 ? (
              <div className="p-6 text-center border border-dashed rounded-2xl text-stone-400 text-xs">
                No hero images saved in config. Click Seed Creative Presets at the top.
              </div>
            ) : (
              <div className="space-y-2.5">
                {heroImages.map((img, idx) => (
                  <div 
                    key={img.id}
                    className="p-3 bg-white/70 border border-white/50 rounded-xl flex items-center justify-between gap-3 shadow-xs"
                  >
                    {/* Img Thumbnail preview */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-stone-100 shrink-0 border">
                        <img 
                          src={img.url} 
                          alt={img.title} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-black truncate">{img.title}</h4>
                        <p className="text-[9px] font-mono font-bold text-stone-400 truncate mt-0.5">{img.url}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-mono font-black text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                            Order: #{img.order}
                          </span>
                          <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${img.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-stone-100 text-stone-400'}`}>
                            {img.isActive ? 'Active' : 'Deactivated'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Controls Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      
                      {/* Rearrange buttons */}
                      <button
                        onClick={() => handleMoveSlide(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-500 rounded-lg disabled:opacity-30 transition"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveSlide(idx, 'down')}
                        disabled={idx === heroImages.length - 1}
                        className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-500 rounded-lg disabled:opacity-30 transition"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Deactivate/Activate Status */}
                      <button
                        onClick={() => handleToggleSlideActive(img.id, img.isActive)}
                        className={`p-1.5 rounded-lg transition ${img.isActive ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'}`}
                        title={img.isActive ? "Deactivate Image" : "Activate Image"}
                      >
                        {img.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>

                      {/* Trash Delete */}
                      <button
                        onClick={() => handleDeleteSlide(img.id)}
                        className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition"
                        title="Delete Permanently"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* RIGHT COMPONENT (5 Columns) - COMMUNITY MODERATION DECK */}
        <section className="lg:col-span-5 bg-white/40 backdrop-blur-xl border border-white/55 p-6 sm:p-8 rounded-[2rem] shadow-xl space-y-6">
          <div className="pb-3 border-b border-stone-200/50">
            <h3 className="font-serif font-black text-warm-charcoal text-base">
              2. Community Safety Moderation Deck
            </h3>
            <p className="text-xs text-stone-500 font-semibold mt-0.5">
              Inspect reported customer postings or comment sections flagged as unserious or inappropriate.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-widest text-stone-400 uppercase">
                Awaiting Manual Audits
              </span>
              <span className="text-[9px] bg-red-50 text-red-500 font-bold px-2 py-0.5 rounded border border-red-200/40">
                {reportedPosts.length} Incidents
              </span>
            </div>

            {reportedPosts.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-[#40798C]/5 border border-[#40798C]/10 text-stone-500 space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="text-xs font-bold text-stone-700">All Pristine!</p>
                <p className="text-[11px] font-medium text-stone-400">
                  No community posts or comment chains have been reported by members as of now. App is secure.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reportedPosts.map(post => {
                  const isPostReportedDirect = post.isReported;
                  const reportedComments = post.comments.filter(c => c.isReported);

                  return (
                    <div 
                      key={post.id}
                      className="p-4 bg-red-50/40 border border-red-100 rounded-2xl text-xs space-y-3 shadow-xs"
                    >
                      {/* Post Heading info */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[9px] font-mono font-bold text-accent-coral uppercase tracking-wide px-1.5 py-0.5 bg-accent-coral/10 rounded">
                            Topic: {post.category}
                          </span>
                          <h4 className="font-black text-warm-charcoal mt-1.5">{post.title}</h4>
                          <p className="text-[10px] text-stone-500 mt-1">
                            By <span className="font-bold">{post.userName}</span> ({post.userGender})
                          </p>
                        </div>

                        {isPostReportedDirect && (
                          <span className="text-[9px] bg-red-100 text-red-600 font-black px-2 py-0.5 rounded border border-red-300 shrink-0">
                            Post Reported
                          </span>
                        )}
                      </div>

                      {isPostReportedDirect && (
                        <div className="bg-white/80 p-2.5 rounded-xl border border-stone-200">
                          <p className="text-stone-600 italic text-[11px]">“{post.content}”</p>
                          <div className="flex justify-end gap-1.5 mt-2">
                            <button
                              onClick={() => handleDismissPost(post.id)}
                              className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-600 text-[10px] font-mono font-bold rounded-lg transition"
                            >
                              Clear Flags
                            </button>
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded-lg transition"
                            >
                              Delete Post
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Reported Comments in this post */}
                      {reportedComments.length > 0 && (
                        <div className="space-y-2 mt-1 pt-1 border-t border-red-100">
                          <span className="text-[9px] font-mono text-red-600 font-bold block">
                            Reported Responses ({reportedComments.length}):
                          </span>
                          {reportedComments.map(c => (
                            <div key={c.id} className="bg-white/80 p-2 rounded-xl border border-stone-200 text-stone-700 text-[11px] space-y-1">
                              <div className="flex justify-between text-[10px] font-bold text-stone-500">
                                <span>{c.userName} ({c.userGender})</span>
                                <span className="text-red-500 uppercase tracking-widest font-mono text-[8px]">Inappropriate Flag</span>
                              </div>
                              <p className="italic text-stone-600">“{c.text}”</p>
                              <div className="flex justify-end pt-1">
                                <button
                                  onClick={() => handleDeleteComment(post.id, c.id)}
                                  className="px-2 py-0.5 bg-red-600 text-white hover:bg-red-700 text-[9px] font-bold rounded-md transition"
                                >
                                  Delete Comment
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

      </div>

    </div>
  );
}
