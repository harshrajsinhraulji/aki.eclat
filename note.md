# Aki's World — Pending Items & Notes

> Last updated: 2026-05-19
> Status: Firebase fully live. Remaining: photography, social links, email.

---

## 🔴 BLOCKING (Must complete before launch)

### 1. Firebase Project ✅ DONE
- [x] **Project:** `aki-in-a-nutshell` (existing project, reused)
- [x] **Firestore enabled** — rules deployed, confessions collection protected
- [x] **Realtime Database** — ✅ enabled + rules deployed
- [x] **`.env.local` filled with real credentials**

**Live project console:** https://console.firebase.google.com/project/aki-in-a-nutshell

**`.env.local` (already filled):**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCMXsoJYOaz7V6OPKy1PBw2K3kZsfzAFSg
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=aki-in-a-nutshell.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://aki-in-a-nutshell-default-rtdb.europe-west1.firebasedatabase.app
NEXT_PUBLIC_FIREBASE_PROJECT_ID=aki-in-a-nutshell
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=aki-in-a-nutshell.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=369477414922
NEXT_PUBLIC_FIREBASE_APP_ID=1:369477414922:web:695e542e621916ecb62ff3
```

### 2. Photography
- [ ] **`/public/aki-cake.png`** — The Coconut (01) section has `<Image src="/aki-cake.png" />`. This file does not exist in `/public`. Add the real photo (Aki holding the pink cake). Optimal size: 1200×1600px, WebP preferred.
- [ ] **`/public/audio/drinkee-preview.mp3`** — The vinyl player references this file. Add a ~30s preview clip or replace with the correct track.

### 3. Real Email Address
- [ ] Update `akiMeta.email` in `lib/data.ts` (currently `aki@example.com`)
- [ ] Update `href="mailto:aki@example.com"` in `components/sections/LetsTalk.tsx` (line ~107)

---

## 🟡 PENDING INFO (Waiting on Aki)

### 4. 7cups ID ← **WAITING**
- [ ] **Aki's 7cups username** — will link from Universe (02 — Mind card) and social links
- **Where to add once received:**
  - `lib/data.ts` → `socialLinks` array → `{ label: '7cups' }` → fill `username` and `href`
  - `components/sections/Universe.tsx` → Card `id: 3` (Mind) → update description + add link

### 🔒 Privacy Decision (Aki's call)
The following will **not** be shared on the site:
- Email address
- Instagram
- LinkedIn

Only public channels: **Discord** (`discord.gg/xZm4yztnrE`) and **7cups** (when provided).

---

## 🟢 CONFIRMED & DONE

| Item | Status | Location |
|------|--------|----------|
| Discord server invite | ✅ `https://discord.gg/xZm4yztnrE` | `LetsTalk.tsx`, `lib/data.ts` |
| Discord username | ✅ `aki.eclat` | `lib/data.ts → socialLinks` |
| Confessions wall `/confessions` | ✅ Built & linked from navbar + hero + teaser | `app/confessions/page.tsx` |
| Confessions API (server-side) | ✅ Rate limited, honeypot, sanitised | `app/api/confessions/route.ts` |
| Admin panel (Konami code) | ✅ `↑↑↓↓←→←→` unlocks CMS | Hidden in layout-client |
| Navbar overlap fix | ✅ CSS 3-column grid, no absolute positioning | `Navbar.tsx` |
| Security headers | ✅ HSTS, CSP, X-Frame-Options, X-Content-Type | `next.config.ts` |
| Mobile nav classes | ✅ `nav-desktop` / `nav-mobile` via CSS | `globals.css` |
| `♡ Spill` link in Hero | ✅ Visible before navbar appears | `Hero.tsx` |
| ConfessionsTeaser on homepage | ✅ Shows 3 sample notes + "Enter the Wall" CTA | `ConfessionsTeaser.tsx` |
| Broken nav anchors fixed | ✅ `#about → #coconut`, `#stories → #plushies` | `lib/data.ts` |

---

## 🔧 OPTIONAL POLISH (Nice to have)

- [x] **OG Image** — `app/opengraph-image.tsx` + `/public/og-image.png` — served at `/opengraph-image`
- [x] **Favicon** — `app/icon.tsx` (dynamic edge) + `/public/icon.png` — 512×512 pink bow
- [x] **Layout metadata** — `metadataBase`, title template, full OG + Twitter card, icon refs
- [x] **`/writings` route** — atmospheric coming-soon in dark Universe aesthetic; poem fragments scattered as bg texture
- [x] **ArtWords pill linked** — "dropping soon, aneh" pill now routes to `/writings` with hover state
- [ ] **Plushie photos** — Waiting on Aki to provide real plushie photos (emoji for now is fine)
- [ ] **Real confessions** — Firebase live; submissions will populate wall naturally once site is public

---

## 📋 FIREBASE REMAINING STEPS

1. **Enable Realtime Database** (only remaining step):
   - Go to: https://console.firebase.google.com/project/aki-in-a-nutshell/database
   - Click **"Create Database"**
   - Choose region: **`europe-west1`**
   - Start in **locked mode** (we deploy our own rules)
   - After creation, update `.env.local` if the URL differs from:
     `https://aki-in-a-nutshell-default-rtdb.europe-west1.firebasedatabase.app`
     

2. Deploy RTDB rules (from project root): `npx firebase deploy --only database`

3. Restart dev server: `npm run dev`

4. Test the Confessions wall: http://localhost:3000/confessions

5. Test Admin panel: press `↑↑↓↓←→←→` on any page

---

## 📁 KEY FILES REFERENCE

| File | Purpose |
|------|---------|
| `lib/data.ts` | All static content: ticker, plushies, social links, nav, meta |
| `lib/firebase.ts` | Firebase client factory (null-safe, graceful fallback) |
| `.env.local` | Firebase credentials — **never commit to git** |
| `app/api/confessions/route.ts` | Secure server-side confessions API |
| `components/sections/LetsTalk.tsx` | Social links, email CTA (final section) |
| `components/layout/AdminPanel.tsx` | Live CMS panel (Konami code activated) |
| `next.config.ts` | Security headers (HSTS, CSP, X-Frame-Options) |
| `app/globals.css` | Design tokens, grain texture, nav CSS classes |
| `components/sections/ConfessionsTeaser.tsx` | Homepage teaser → `/confessions` |
| `app/confessions/page.tsx` | Full confessions wall page |
