import React, { useState } from 'react';
import { ArrowDown, ArrowUp, CheckCircle, Eye, EyeOff, ImagePlus, ShieldAlert, Trash2, XCircle } from 'lucide-react';
import { AppLanguage, ContentReport, HeroImage, IntroductionRequest } from '../types';
import { TRANSLATIONS } from '../lib/translations';

interface AdminScreenProps {
  isAdmin: boolean;
  locale: AppLanguage;
  heroImages: HeroImage[];
  reports: ContentReport[];
  introductionRequests: IntroductionRequest[];
  onAddHeroImage: (url: string, alt: string) => Promise<void>;
  onUpdateHeroImage: (id: string, updates: Partial<HeroImage>) => Promise<void>;
  onRemoveHeroImage: (id: string) => Promise<void>;
  onMoveHeroImage: (id: string, direction: 'up' | 'down') => Promise<void>;
  onModerateContent: (targetType: 'profile' | 'post', targetId: string, action: 'hide' | 'delete') => Promise<void>;
  onDecideIntroductionRequest: (id: string, decision: 'accept' | 'decline') => Promise<void>;
}

export default function AdminScreen({
  isAdmin,
  locale,
  heroImages,
  reports,
  introductionRequests,
  onAddHeroImage,
  onUpdateHeroImage,
  onRemoveHeroImage,
  onMoveHeroImage,
  onModerateContent,
  onDecideIntroductionRequest
}: AdminScreenProps) {
  const t = TRANSLATIONS[locale] || TRANSLATIONS.ar;
  const [newUrl, setNewUrl] = useState('');
  const [newAlt, setNewAlt] = useState('');

  if (!isAdmin) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white/75 border border-white/80 rounded-[1.5rem] p-8 text-center">
          <ShieldAlert className="w-10 h-10 text-accent-coral mx-auto" />
          <h2 className="mt-3 text-2xl font-serif font-black text-warm-charcoal">{t.adminAccessRequired}</h2>
          <p className="text-sm text-[#6B635B] mt-2">{t.adminConfigNotice}</p>
        </div>
      </div>
    );
  }

  const addImage = async () => {
    if (!newUrl.trim()) return;
    await onAddHeroImage(newUrl.trim(), newAlt.trim() || 'Hero image');
    setNewUrl('');
    setNewAlt('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <section className="bg-white/75 border border-white/80 rounded-[1.5rem] p-5 sm:p-6 shadow-lg text-start">
        <span className="text-[10px] font-black uppercase tracking-widest text-accent-coral">{t.adminPanel}</span>
        <h2 className="text-2xl sm:text-3xl font-serif font-black text-warm-charcoal mt-1">{t.heroSettings}</h2>
        <p className="text-sm text-[#6B635B] mt-2">{t.adminConfigNotice}</p>
      </section>

      <section className="bg-white/75 border border-white/80 rounded-[1.5rem] p-5 shadow text-start space-y-4">
        <h3 className="text-lg font-serif font-black text-warm-charcoal">{t.manageHero}</h3>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_auto] gap-3">
          <input value={newUrl} onChange={(event) => setNewUrl(event.target.value)} className="input-basic" placeholder={t.imageUrl} />
          <input value={newAlt} onChange={(event) => setNewAlt(event.target.value)} className="input-basic" placeholder={t.altText} />
          <button type="button" onClick={addImage} className="rounded-xl bg-warm-charcoal text-white px-5 py-3 text-xs font-bold flex items-center justify-center gap-1.5">
            <ImagePlus className="w-4 h-4" />
            {t.addImage}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {heroImages.map((image, index) => (
            <div key={image.id} className="rounded-2xl bg-white border border-stone-200 overflow-hidden">
              <img src={image.url} alt={image.alt} className="w-full aspect-[16/7] object-cover" referrerPolicy="no-referrer" />
              <div className="p-4 space-y-3">
                <input value={image.url} onChange={(event) => onUpdateHeroImage(image.id, { url: event.target.value })} className="input-basic" />
                <input value={image.alt} onChange={(event) => onUpdateHeroImage(image.id, { alt: event.target.value })} className="input-basic" />
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => onMoveHeroImage(image.id, 'up')} disabled={index === 0} className="admin-icon-btn disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button>
                  <button type="button" onClick={() => onMoveHeroImage(image.id, 'down')} disabled={index === heroImages.length - 1} className="admin-icon-btn disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button>
                  <button type="button" onClick={() => onUpdateHeroImage(image.id, { active: !image.active })} className={`admin-icon-btn ${image.active ? 'text-[#40798C]' : 'text-stone-400'}`}>
                    {image.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button type="button" onClick={() => onRemoveHeroImage(image.id)} className="admin-icon-btn text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white/75 border border-white/80 rounded-[1.5rem] p-5 shadow text-start space-y-4">
        <h3 className="text-lg font-serif font-black text-warm-charcoal">Introduction requests</h3>
        {introductionRequests.length === 0 ? (
          <p className="text-sm text-[#6B635B]">No introduction requests yet.</p>
        ) : (
          <div className="space-y-3">
            {introductionRequests.map((request) => (
              <div key={request.id} className="rounded-2xl bg-white border border-stone-200 p-4 flex flex-col lg:flex-row justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-xs font-black text-warm-charcoal uppercase">
                    {(request.senderName || request.senderEmail || request.senderId)} → {(request.receiverName || request.receiverEmail || request.receiverId)}
                  </p>
                  <p className="text-xs text-[#6B635B]">
                    Sender: {request.senderEmail || request.senderId} · Receiver: {request.receiverEmail || request.receiverId}
                  </p>
                  <p className="text-[10px] text-[#6B635B]">
                    {request.status.toUpperCase()} · {request.createdAt || 'No date'}
                  </p>
                </div>
                {request.status === 'pending' ? (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onDecideIntroductionRequest(request.id, 'accept')}
                      className="rounded-xl bg-[#40798C] text-white px-4 py-2 text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => onDecideIntroductionRequest(request.id, 'decline')}
                      className="rounded-xl bg-red-50 text-red-700 border border-red-100 px-4 py-2 text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      Decline
                    </button>
                  </div>
                ) : (
                  <span className="rounded-xl bg-stone-100 text-[#6B635B] px-4 py-2 text-xs font-black self-start">
                    {request.status === 'accepted' ? 'Accepted' : 'Declined'}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-white/75 border border-white/80 rounded-[1.5rem] p-5 shadow text-start space-y-4">
        <h3 className="text-lg font-serif font-black text-warm-charcoal">{t.reportedContent}</h3>
        {reports.length === 0 ? (
          <p className="text-sm text-[#6B635B]">{t.noReportsYet}</p>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <div key={report.id} className="rounded-2xl bg-white border border-stone-200 p-4 flex flex-col sm:flex-row justify-between gap-3">
                <div>
                  <p className="text-xs font-black text-warm-charcoal uppercase">
                    {report.targetType === 'profile' ? t.profileTarget : t.postTarget} · {report.targetId}
                  </p>
                  <p className="text-xs text-[#6B635B] mt-1">{report.reason}</p>
                  <p className="text-[10px] text-[#6B635B] mt-1">{report.status === 'resolved' ? t.resolvedReport : t.openReport}</p>
                </div>
                <button type="button" onClick={() => onModerateContent(report.targetType, report.targetId, 'hide')} disabled={report.status === 'resolved'} className="rounded-xl bg-red-50 text-red-700 border border-red-100 px-4 py-2 text-xs font-bold disabled:opacity-40">
                  {t.hide} / {t.delete}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
