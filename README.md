# Aki's World — The £250,000 Interactive Installation

> *"Minimalism with warmth. Spaces that make me feel something before I understand why."*

Welcome to the source code for **Aki's World** (`aki.eclat`). This is not a standard portfolio or a basic Next.js app. It is a highly engineered, psychologically driven digital installation designed to mirror the nuances of high-end interior design and cognitive science.

## 🎀 The Philosophy

This project was built under the constraint of treating the browser like a true physical and psychological medium. 
- **The Browser is a Physics Engine:** Every scroll velocity, mouse twitch, and button interaction is mapped to spring physics, providing mechanical tension and haptic feedback.
- **Temporal Physics:** The entire aesthetic of the application responds to the actual local time of day of the user (Dawn, Noon, Dusk, Midnight).
- **The Edge of the Web:** Hosted entirely on the Edge, utilizing Next.js Turbopack, Framer Motion heavily memoized springs, and Zero-CLS predictive rendering.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** Next.js 16 (App Router) + Turbopack
- **Language:** TypeScript (Strict End-to-End Type Safety)
- **Styling:** CSS Modules + Inline CSS Variables (No Tailwind by design; absolute pixel control)
- **Physics & Animation:** Framer Motion (Hardware-accelerated springs, velocity tracking)
- **Typography:** Custom locally hosted fonts (`Bodoni Moda`, `Instrument Serif`, `Figtree`)
- **Hosting:** Vercel Edge Network

---

## 🎭 The Hidden Architecture (Category VI)

This site contains secrets. It is designed to reward curiosity and punish impatience.
1. **The Konami Code (`A K I`)**: Typing this sequence globally shatters the interface with an aggressive, beautiful glitch sequence.
2. **The 2:00 AM Lock**: Certain thoughts and content in the "Universe" section are entirely illegible and blurred unless your physical machine clock reads precisely between `02:00:00` and `02:59:59`.
3. **The Absolute Absence**: `/absence`. A completely hidden, unlinked route. It tracks your mouse. If you can sit perfectly still for 10 seconds in the pure #0A0306 void, it speaks to you. If you twitch, it dies.
4. **The Self-Destruct Sequence**: A 4-pixel transparent red dot in the footer. 5 rapid clicks sequentially animates every DOM node to scale to 0 and disappear, completely destroying the visual site before a forced reboot.

---

## 🚀 Local Development

To run the installation locally with the required 4GB heap allocation:

```bash
# Install strict dependencies
npm install

# Run the development server (Windows PowerShell)
$env:NODE_OPTIONS="--max-old-space-size=4096"; npm run dev

# Run the development server (Mac/Linux)
NODE_OPTIONS="--max-old-space-size=4096" npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deployment (Vercel)

This project is built to deploy out-of-the-box on Vercel with zero configuration required.
1. Connect this GitHub repository to Vercel.
2. Vercel will auto-detect Next.js.
3. Keep default build command (`npm run build`).
4. **Deploy**. The Edge runtime will handle the rest.

See `DEPLOYMENT_GUIDE.md` for extended deployment strategies.

---

*Built with absolute precision. Diamond 1 mechanics.*
