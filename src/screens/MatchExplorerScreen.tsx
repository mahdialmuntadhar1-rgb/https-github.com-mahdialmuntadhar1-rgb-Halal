import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Bookmark, Heart, Loader2, MapPin, Search, ShieldCheck } from 'lucide-react';
import { AppLanguage, MatchProfile, SearchFilters } from '../types';
import EmptyState from '../components/EmptyState';
import MatchCard from '../components/MatchCard';
import Modal from '../components/Modal';
import { TRANSLATIONS } from '../lib/translations';
import { displayValue, labelFor } from '../i18n/labels';
import { apiClient } from '../lib/apiClient';

interface MatchExplorerScreenProps {
  locale: AppLanguage;
  onToggleSaved: (id: string) => void;
  onReportProfile: (id: string) => void;
  userGender: 'male' | 'female';
}

export default function MatchExplorerScreen({
  locale,
  onToggleSaved,
  onReportProfile,
  userGender
}: MatchExplorerScreenProps) {
  const t = TRANSLATIONS[locale] || TRANSLATIONS.ar;
  const [matches, setMatches] = useState<MatchProfile[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<MatchProfile | null>(null);
  const [city, setCity] = useState('All');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const governorates = useMemo(
    () => ['All', 'Baghdad', 'Basra', 'Nineveh', 'Erbil', 'Sulaymaniyah', 'Duhok', 'Kirkuk', 'Najaf', 'Karbala', 'Babil', 'Wasit', 'Diyala', 'Anbar', 'Salah al-Din', 'Maysan', 'Dhi Qar', 'Muthanna', 'Qadisiyah', 'Halabja'],
    []
  );

  const buildFilters = (): Partial<SearchFilters> => ({
    gender: userGender === 'male' ? 'female' : 'male',
    minAge: 18,
    maxAge: 45,
    governorate: city,
  });

  const loadMatches = async (nextPage = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.getMatches(buildFilters(), nextPage, limit);
      setMatches((current) => (nextPage === 1 ? response.matches : [...current, ...response.matches]));
      setPage(response.page);
      setHasMore(response.hasMore);
      setTotal(response.total);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load matches';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMatches(1);
  }, [city, userGender]);

  const handleToggleSaved = async (id: string) => {
    const match = matches.find((item) => item.id === id);
    const nextSaved = !(match?.saved || false);
    await apiClient.saveProfile(id, nextSaved);
    setMatches((current) => current.map((item) => (item.id === id ? { ...item, saved: nextSaved } : item)));
    if (selectedMatch?.id === id) setSelectedMatch({ ...selectedMatch, saved: nextSaved });
    onToggleSaved(id);
  };

  const handleSendIntroductionRequest = async (id: string) => {
    await apiClient.sendIntroductionRequest(id);
    setMatches((current) => current.map((item) => (item.id === id ? { ...item, requestStatus: 'sent' } : item)));
    if (selectedMatch?.id === id) setSelectedMatch({ ...selectedMatch, requestStatus: 'sent' });
  };

  const filteredMatches = matches
    .filter((match) => city === 'All' || match.governorate === city)
    .filter((match) => !showSavedOnly || match.saved)
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8" id="match-explorer-screen">
      <section className="bg-white/65 border border-white/70 rounded-[1.5rem] p-5 sm:p-6 shadow-lg shadow-stone-200/25">
        <div className="flex flex-col lg:flex-row justify-between gap-4 lg:items-center">
          <div className="text-start">
            <span className="text-[10px] font-black uppercase tracking-widest text-accent-coral">
              {t.exploreMembers}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-warm-charcoal mt-1">
              {t.exploreMembersTitle}
            </h2>
            <p className="text-sm text-[#6B635B] mt-2 max-w-2xl">
              {t.exploreMembersSub}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <label className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B635B]" />
            <select
                value={city}
                onChange={(event) => {
                  setCity(event.target.value);
                  setPage(1);
                }}
                className="appearance-none bg-white border border-stone-200 rounded-xl pl-9 pr-8 py-3 text-xs font-bold text-warm-charcoal min-w-[190px]"
              >
                {governorates.map((gov) => (
                  <option key={gov} value={gov}>
                    {gov === 'All' ? t.allGovernorates : displayValue(gov, locale)}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() => setShowSavedOnly((value) => !value)}
              className={`rounded-xl px-4 py-3 text-xs font-black border flex items-center justify-center gap-1.5 ${
                showSavedOnly ? 'bg-accent-coral text-white border-accent-coral' : 'bg-white text-warm-charcoal border-stone-200'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${showSavedOnly ? 'fill-white' : ''}`} />
              {t.savedProfiles}
            </button>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between gap-3 text-xs font-bold text-[#6B635B]">
        <span>{total} {t.exploreMembers}</span>
        {isLoading && (
          <span className="inline-flex items-center gap-1 text-[#40798C]">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Loading
          </span>
        )}
      </div>

      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 text-red-700 p-4 text-sm font-bold">
          {error}
        </div>
      )}

      {!isLoading && filteredMatches.length === 0 ? (
        <EmptyState
          title={t.noMembersFound}
          description={t.tryChangingFilters}
          actionText={t.showAllMembers}
          onAction={() => {
            setCity('All');
            setShowSavedOnly(false);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMatches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              locale={locale}
              onToggleSaved={handleToggleSaved}
              onReport={onReportProfile}
              onOpenDetails={setSelectedMatch}
            />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => loadMatches(page + 1)}
            disabled={isLoading}
            className="rounded-xl bg-warm-charcoal text-white px-5 py-3 text-xs font-black disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Load more'}
          </button>
        </div>
      )}

      <Modal
        isOpen={selectedMatch !== null}
        onClose={() => setSelectedMatch(null)}
        title={selectedMatch ? `${selectedMatch.name}, ${selectedMatch.age}` : t.profile}
      >
        {selectedMatch && (
          <div className="space-y-5 text-start">
            <div className="flex items-center justify-between gap-3 border-b border-stone-200 pb-4">
              <div>
                <p className="text-xs font-bold text-[#6B635B] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#40798C]" />
                  {displayValue(selectedMatch.governorate, locale)}, {displayValue(selectedMatch.country, locale)}
                </p>
                <p className="text-xs font-bold text-[#40798C] mt-1">{displayValue(selectedMatch.education, locale)}</p>
              </div>
              <span className="rounded-xl bg-accent-coral/10 text-accent-coral border border-accent-coral/20 px-3 py-2 text-xs font-black">
                {selectedMatch.compatibilityScore}% {t.compatibility}
              </span>
            </div>

            <div className="rounded-2xl bg-[#40798C]/5 border border-[#40798C]/15 p-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-[#40798C] mb-2">
                {t.shortBio}
              </h4>
              <p className="text-sm text-warm-charcoal leading-relaxed">"{selectedMatch.aboutMe}"</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <Info label={t.marriageIntention} value={labelFor(selectedMatch.intention || 'Serious for marriage', t)} />
              <Info label={t.courtshipTimeline} value={selectedMatch.timeline} />
              <Info label={t.profession} value={selectedMatch.profession} />
              <Info label={t.wantsChildren} value={selectedMatch.wantsChildren} />
            </div>

            <div className="flex flex-wrap gap-2">
              {(selectedMatch.intentionBadges || []).map((badge) => (
                <span key={badge} className="rounded-lg bg-white border border-stone-200 px-3 py-1.5 text-[10px] font-black text-warm-charcoal">
                  {labelFor(badge, t)}
                </span>
              ))}
            </div>

            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900 flex gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{t.exploreMembersSub}</p>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleToggleSaved(selectedMatch.id)}
                className="rounded-xl bg-warm-charcoal text-white px-5 py-3 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Bookmark className="w-4 h-4" />
                {selectedMatch.saved ? t.removeSaved : t.saveProfile}
              </button>
              {selectedMatch.requestStatus === 'none' && (
                <button
                  type="button"
                  onClick={() => handleSendIntroductionRequest(selectedMatch.id)}
                  className="rounded-xl bg-accent-coral text-white px-5 py-3 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Heart className="w-4 h-4" />
                  Send request
                </button>
              )}
              {selectedMatch.requestStatus === 'sent' && (
                <span className="rounded-xl bg-accent-coral/10 text-accent-coral border border-accent-coral/20 px-5 py-3 text-xs font-black">
                  Request sent
                </span>
              )}
              <button
                type="button"
                onClick={() => onReportProfile(selectedMatch.id)}
                className="rounded-xl bg-white border border-stone-200 text-red-600 px-5 py-3 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <AlertTriangle className="w-4 h-4" />
                {t.report}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/80 border border-stone-200 rounded-2xl p-3">
      <span className="block text-[9px] font-black uppercase tracking-widest text-[#6B635B]">{label}</span>
      <span className="block mt-1 font-bold text-warm-charcoal">{value}</span>
    </div>
  );
}
