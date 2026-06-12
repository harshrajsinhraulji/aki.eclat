/**
 * lib/data.ts
 * All static content for Aki's world.
 * Edit here — never hardcode in components.
 */

/* ─────────────────────────────────────────────
   TICKER CONTENT
   Aki edits this from her admin panel.
   Stored here as default / fallback.
───────────────────────────────────────────── */

export const tickerItems = [
  { type: 'heart' as const, text: 'reading: the secret history' },
  { type: 'star' as const, text: 'obsessed with manta rays rn' },
  { type: 'heart' as const, text: 'sofi tukker forever' },
  { type: 'star' as const, text: "aneh, i simply cannot" },
  { type: 'heart' as const, text: 'wearing: oversized bows' },
  { type: 'star' as const, text: 'drinkee on repeat' },
  { type: 'heart' as const, text: 'diamond 1 and thriving' },
  { type: 'star' as const, text: 'sri lanka always' },
  { type: 'heart' as const, text: 'maldives soon' },
  { type: 'star' as const, text: "can't, aneh" },
]

/* ─────────────────────────────────────────────
   PLUSHIE GANG
───────────────────────────────────────────── */

export const plushies = [
  {
    id: 'mrfrogster',
    image: '/images/plushies/mrfrogster.png',
    name: 'Mr. Frogster',
    lore: 'My therapist. He listens without judgment and always knows what to say.',
    isSpecial: false,
    color: '#719542',
  },
  {
    id: 'bunbun',
    image: '/images/plushies/bunbun.png',
    name: 'Bun bun',
    lore: 'Softest ears in the universe. Essential for 2 AM poetry writing.',
    isSpecial: false,
    color: '#D8C6C3',
  },
  {
    id: 'sharkie',
    image: '/images/plushies/sharkie.png',
    name: 'Sharkie',
    lore: "Fierce protector of the bed. Don't let the teeth fool you, he's a softie.",
    isSpecial: true,
    color: '#497395',
  },
  {
    id: 'lily',
    image: '/images/plushies/lily.png',
    name: 'Lily',
    lore: 'The elegant one. Always smells faintly of lavender and good decisions.',
    isSpecial: false,
    color: '#B094C6',
  },
  {
    id: 'misscakey',
    image: '/images/plushies/misscakey.png',
    name: 'Miss Cakey',
    lore: 'Sweetness personified. The designated emotional support plushie.',
    isSpecial: false,
    color: '#E59FB6',
  },
  {
    id: 'ladykuromi',
    image: '/images/plushies/ladykuromi.png',
    name: 'Lady kuromi',
    lore: 'Dark aesthetic but a heart of gold. We understand each other perfectly.',
    isSpecial: false,
    color: '#1A1821',
  },
]

/* ─────────────────────────────────────────────
   MUSIC
───────────────────────────────────────────── */

export const nowPlaying = {
  title: 'Drinkee',
  artist: 'Sofi Tukker',
  audioSrc: '/audio/drinkee-preview.mp3',
}

/* ─────────────────────────────────────────────
   NAV LINKS
───────────────────────────────────────────── */

export const navLinks = [
  { label: 'About', href: '#coconut' },
  { label: 'Closet', href: '#closet' },
  { label: 'Art', href: '#art' },
  { label: 'Gang', href: '#plushies' },
  { label: 'Spill', href: '/confessions' },
  { label: 'Play', href: '/arcade' },
]

/* ─────────────────────────────────────────────
   OBSESSIONS (for future sections)
───────────────────────────────────────────── */

export const obsessions = [
  'Interior Design',
  'Colour Theory',
  'Human Psychology',
  'League of Legends',
  'Sofi Tukker',
  'Manta Rays',
  'Polaroid Photography',
  'Maldives',
  'Sri Lanka',
  'Harry Potter',
  'Manga',
  'The Secret History',
  'Oversized Bows',
  'Vinyl Records',
  'I write poems at 2am',
]

/* ─────────────────────────────────────────────
   AKI'S PHRASES
───────────────────────────────────────────── */

export const akiPhrases = [
  "I can't, aneh",
  "aneh, I'm just a girl 🎠",
  "aneh, please",
  "I simply cannot, aneh",
  "aneh, no way",
]

/* ─────────────────────────────────────────────
   SOCIAL LINKS — Single source of truth.
   Update here; components import from here.
───────────────────────────────────────────── */

export const socialLinks = [
  {
    label: 'Discord',
    username: 'aki.eclat',
    href: 'https://discord.gg/xZm4yztnrE',
    symbol: '◇',
  },
  {
    label: '7cups',
    username: null, // TODO: fill in when Aki provides her 7cups ID
    href: null,
    symbol: '♡',
  },
]

/* ─────────────────────────────────────────────
   AKI META — Bio data for use across sections.
───────────────────────────────────────────── */

export const akiMeta = {
  name: 'Aki',
  handle: 'aki.eclat',
  origin: 'Sri Lanka',
  base: 'London',
  study: 'Interior Design',
  leagueRank: 'Diamond 1',
}

