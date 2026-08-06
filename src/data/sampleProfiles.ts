/**
 * Demonstration sample profiles for empty governorates.
 * Always flagged with isDemoProfile: true — never mixed into live lists when real members exist.
 */
import { MatchProfile } from '../types';
import { GOVERNORATES } from '../constants';
import { INITIAL_MATCHES } from './matches';

function normalizeGov(value: string): string {
  const v = value.trim().toLowerCase();
  if (v === 'mosul' || v === 'ninawa') return 'nineveh';
  if (v === 'slemani' || v === 'sulaimaniyah') return 'sulaymaniyah';
  if (v === 'babel') return 'babil';
  return v;
}

function isAllIraq(gov?: string): boolean {
  if (!gov) return true;
  const v = gov.trim().toLowerCase();
  return v === '' || v === 'all iraq' || v === 'all';
}

/**
 * Curated samples for one governorate: up to 2 female + 2 male.
 * IDs are prefixed with `sample-` so they can never collide with real user UUIDs.
 */
export function getSampleProfilesForGovernorate(
  governorate: string,
  genderFilter?: 'male' | 'female' | '',
): MatchProfile[] {
  const govNorm = normalizeGov(governorate);
  const pool = INITIAL_MATCHES.filter(
    (m) => m.isDemoProfile && normalizeGov(m.governorate || '') === govNorm,
  );

  const take = (gender: 'male' | 'female', n: number) =>
    pool
      .filter((m) => m.gender === gender)
      .slice(0, n)
      .map((m, idx) => toPublicSample(m, idx));

  if (genderFilter === 'male') return take('male', 4);
  if (genderFilter === 'female') return take('female', 4);
  return [...take('female', 2), ...take('male', 2)];
}

/**
 * When Explore is set to All Iraq and the platform has zero real members,
 * show a small cross-governorate demonstration set (not the full catalog).
 */
export function getSampleProfilesForEmptyExplore(
  genderFilter?: 'male' | 'female' | '',
): MatchProfile[] {
  const out: MatchProfile[] = [];
  for (const gov of GOVERNORATES) {
    const locals = getSampleProfilesForGovernorate(gov, genderFilter);
    // 1 profile per governorate keeps All-Iraq empty state light
    if (locals[0]) out.push(locals[0]);
    if (out.length >= 12) break;
  }
  return out;
}

export function resolveSampleProfilesForFilters(filters: {
  governorate?: string;
  gender?: 'male' | 'female' | '';
}): MatchProfile[] {
  if (isAllIraq(filters.governorate)) {
    return getSampleProfilesForEmptyExplore(filters.gender);
  }
  return getSampleProfilesForGovernorate(filters.governorate!, filters.gender);
}

function toPublicSample(source: MatchProfile, idx: number): MatchProfile {
  const slug = `${normalizeGov(source.governorate || 'iq')}-${source.gender}-${idx}`;
  return {
    ...source,
    id: `sample-${slug}-${source.id}`,
    verified: false,
    isOnline: false,
    requestStatus: 'none',
    isDemoProfile: true,
    badges: ['Sample Profile'],
    // Keep female privacy model: prefer blurred/initials over fully visible faces for samples
    photoStatus:
      source.gender === 'female' && source.photoStatus === 'visible'
        ? 'blurred'
        : source.photoStatus,
  };
}

export function isSampleProfileId(id: string | undefined | null): boolean {
  return typeof id === 'string' && id.startsWith('sample-');
}
