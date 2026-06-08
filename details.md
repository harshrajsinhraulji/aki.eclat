# Aki's World (`aki.eclat`) — Comprehensive Project Details

## Overview
**Aki's World** is a high-end, psychologically driven digital installation. Designed as an interactive digital portfolio and experience, it treats the browser as a physical medium rather than a static document viewer. The project embraces "minimalism with warmth," utilizing temporal physics, high-performance animations, and hidden interactions to evoke an emotional response.

## Key Features

### 1. Physics-Driven UI
Every scroll velocity, mouse twitch, and button interaction is mapped to spring physics. This provides mechanical tension and haptic-like feedback, powered by hardware-accelerated Framer Motion springs.

### 2. Temporal Aesthetics
The entire visual state of the application responds dynamically to the user's actual local time, shifting between Dawn, Noon, Dusk, and Midnight color palettes and moods.

### 3. Confessions Wall (`/confessions`)
A secure, real-time message board powered by Firebase Realtime Database and Firestore. It includes a server-side API (`/api/confessions`) featuring rate limiting, honeypots, and input sanitization to maintain a safe environment.

### 4. Admin Panel CMS
A live Content Management System hidden within the layout, accessible only via a classic Konami code sequence (`↑↑↓↓←→←→`).

### 5. Custom Typography
Uses locally hosted, high-end fonts (`Bodoni Moda`, `Instrument Serif`, `Figtree`) to maintain absolute pixel control and editorial-grade kerning without relying on external CDNs.

---

## Category VI: The Hidden Architecture (Secrets)
The site is specifically designed to reward curiosity and punish impatience with several easter eggs:

* **The `A K I` Glitch**: Typing the sequence "A K I" globally shatters the interface with an aggressive, beautiful glitch sequence.
* **The 2:00 AM Lock**: Certain deep thoughts in the "Universe" section remain illegible and blurred unless the user's physical machine clock reads precisely between `02:00:00` and `02:59:59`.
* **The Absolute Absence (`/absence`)**: A completely hidden, unlinked route. It tracks mouse movement. If the user sits perfectly still for 10 seconds in a pure `#0A0306` void, it speaks to them. A single twitch kills the interaction.
* **The Self-Destruct Sequence**: A hidden 4-pixel transparent red dot resides in the footer. 5 rapid clicks sequentially animate every DOM node to scale to 0, completely destroying the visual site before a forced reboot.

---

## Technical Stack & Architecture

* **Framework:** Next.js 16 (App Router) + Turbopack for maximum build and run performance.
* **Language:** TypeScript, heavily utilizing strict end-to-end type safety.
* **Styling:** CSS Modules + Inline CSS Variables. Tailwind was intentionally omitted in favor of absolute pixel-perfect CSS control.
* **Animation & Physics:** Framer Motion, GSAP, and Lenis (for smooth scrolling).
* **3D & Spatial Computing:** Three.js, React Three Fiber (`@react-three/fiber`), and Drei (`@react-three/drei`).
* **Backend / Database:** Firebase (Realtime Database & Firestore).
* **Deployment & Hosting:** Vercel Edge Network, utilizing predictive rendering and zero-CLS strategies.

---

## How We Built It

1. **The Foundation:** 
   The project was initialized with Next.js 16 and a strict TypeScript configuration. Instead of utility classes, CSS Modules were chosen to enforce a rigorous, bespoke design system driven by dynamic CSS variables.

2. **The Physics Engine:** 
   Framer Motion and GSAP were integrated deeply into the React component lifecycle. We replaced standard easing curves with highly tuned, memoized spring mechanics that tie scroll velocity and cursor movement directly to DOM mutations, bypassing standard React state where possible to ensure 60/120fps performance.

3. **Backend Integration (Firebase):** 
   We connected the app to a Firebase project (`aki-in-a-nutshell`). Firestore rules and Realtime Database rules were deployed securely. We built server-side Next.js API routes (`app/api/confessions/route.ts`) to act as a secure proxy, handling rate-limiting and honeypot validation before writing to the database.

4. **Constructing the Secrets:** 
   Custom React hooks were developed to listen for global keydown events (for the Konami codes). We utilized native JavaScript Date APIs to enforce time-locks (like the 2:00 AM block) purely on the client side to react to local user time.

5. **Performance Mastery:** 
   We ensured Zero Layout Shifts (CLS) through mathematical pre-calculation of dimensions and prioritized edge-computing deployment on Vercel to achieve sub-50ms latency globally.

6. **Future Scalability:** 
   The architecture is primed for the next phase of upgrades (as noted in `REMAINING_UPGRADES.md`), which will introduce WebGL fluid typography, volumetric lighting, and glass refraction.
