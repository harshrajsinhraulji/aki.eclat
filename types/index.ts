/**
 * types/index.ts
 * All TypeScript types for Aki's world.
 * Supabase Database schema + application types.
 */

/* ─────────────────────────────────────────────
   SUPABASE DATABASE SCHEMA
───────────────────────────────────────────── */

export interface Database {
  public: {
    Tables: {
      confessions: {
        Row: Confession
        Insert: ConfessionInsert
        Update: Partial<ConfessionInsert>
      }
      reactions: {
        Row: Reaction
        Insert: ReactionInsert
        Update: Partial<ReactionInsert>
      }
      replies: {
        Row: Reply
        Insert: ReplyInsert
        Update: Partial<ReplyInsert>
      }
      admin_settings: {
        Row: AdminSetting
        Insert: AdminSetting
        Update: Partial<AdminSetting>
      }
    }
  }
}

/* ─────────────────────────────────────────────
   CONFESSION TYPES
───────────────────────────────────────────── */

export interface Confession {
  id: string
  content: string
  author_emoji: string
  is_pinned: boolean
  is_approved: boolean
  created_at: string
  updated_at: string
}

export interface ConfessionInsert {
  content: string
  author_emoji: string
  is_pinned?: boolean
  is_approved?: boolean
}

/* ─────────────────────────────────────────────
   REACTION TYPES
───────────────────────────────────────────── */

export type ReactionEmoji = '💗' | '😭' | '😭' | '🫦' | '✨' | '💀'

export interface Reaction {
  id: string
  confession_id: string
  emoji: ReactionEmoji
  count: number
}

export interface ReactionInsert {
  confession_id: string
  emoji: ReactionEmoji
}

/* ─────────────────────────────────────────────
   REPLY TYPES
───────────────────────────────────────────── */

export interface Reply {
  id: string
  confession_id: string
  content: string
  is_aki: boolean
  created_at: string
}

export interface ReplyInsert {
  confession_id: string
  content: string
  is_aki?: boolean
}

/* ─────────────────────────────────────────────
   ADMIN SETTINGS
───────────────────────────────────────────── */

export interface AdminSetting {
  key: string
  value: string
  updated_at: string
}

/* ─────────────────────────────────────────────
   TICKER TYPES
───────────────────────────────────────────── */

export interface TickerItem {
  type: 'heart' | 'star'
  text: string
}

/* ─────────────────────────────────────────────
   PLUSHIE TYPES
───────────────────────────────────────────── */

export interface Plushie {
  id: string
  emoji: string
  name: string
  lore: string
  isSpecial: boolean
}

/* ─────────────────────────────────────────────
   MOTION TYPES
───────────────────────────────────────────── */

export interface SpringConfig {
  type: 'spring'
  stiffness: number
  damping: number
  mass?: number
}

/* ─────────────────────────────────────────────
   VINYL PLAYER TYPES
───────────────────────────────────────────── */

export interface Track {
  title: string
  artist: string
  audioSrc: string
}

/* ─────────────────────────────────────────────
   NAV LINK TYPES
───────────────────────────────────────────── */

export interface NavLink {
  label: string
  href: string
}

/* ─────────────────────────────────────────────
   VISITOR PRESENCE
───────────────────────────────────────────── */

export interface PresenceState {
  [key: string]: Array<{
    user_id: string
    online_at: string
  }>
}
