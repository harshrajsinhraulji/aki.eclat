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
    id: 'sharky',
    emoji: '🦈',
    name: 'Sharky',
    lore: 'From my boyfriend. On the bed. Always.',
    isSpecial: true,
  },
  {
    id: 'frogster',
    emoji: '🐸',
    name: 'Mr. Frogster',
    lore: 'My therapist. No questions asked.',
    isSpecial: false,
  },
  {
    id: 'bauble',
    emoji: '✨',
    name: 'The Giant Bauble',
    lore: 'A Christmas miracle. Very large.',
    isSpecial: false,
  },
  {
    id: 'stitch',
    emoji: '💙',
    name: 'Stitch',
    lore: "Limited edition. I found him. He's mine.",
    isSpecial: false,
  },
  {
    id: 'kuromi',
    emoji: '🖤',
    name: 'Kuromi',
    lore: 'Dark aesthetic. We understand each other.',
    isSpecial: false,
  },
  {
    id: 'popkorn',
    emoji: '🍿',
    name: 'Popkorn',
    lore: 'Found in Sri Lanka. Named on the spot.',
    isSpecial: false,
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

