# aki.eclat — A Digital Installation

Welcome to the repository for **aki.eclat**, an interactive, world-class personal portfolio and digital art piece.

This is not a traditional website. It is an exploration into treating the browser as a hyper-responsive physics engine and a psychological mirror. Every pixel is intentional, every millisecond is accounted for, and the user leaves feeling like they just walked through a high-end contemporary art gallery.

## The Philosophy
If you hand over £250,000 for a digital experience, you are not buying a website. You are buying a piece of digital architecture that bends the browser to its limits while feeling utterly effortless. The site must possess a soul, spatial awareness, and a level of polish that makes other luxury brands look dated.

We achieved this by breaking the project into **Godly Implementations**, executing interactions that are rarely seen outside of WebGL award sites, yet keeping them accessible, native, and entirely DOM/CSS/Canvas based.

## Core Features & Godly Upgrades

### I. The Hero (Ambient Physics)
- **Kinetic Canvas Particles**: A bare-metal, high-performance Canvas particle system representing ambient dust. It runs off the main thread with `desynchronized: true` to guarantee 120fps physics.
- **Sub-Pixel Anti-Aliasing**: Typography is locked to optical perfection, ensuring the massive serifs of Bodoni Moda render flawlessly.

### II. Sensory & Micro-Interactions
- **Magnetic Velocity Cursor**: The custom cursor tracks physics. It snaps to elements elastically, morphs on hover, and reacts to velocity.
- **Architectural Scrollbar**: The native browser scrollbar is completely overridden with a dynamic, theme-aware architectural tracker.

### III. The Infinite Closet (Re-Engineered)
- **Native Inertia Scrolling**: Hardware-accelerated CSS `scroll-snap-type: x mandatory` ensures the carousel feels like a heavy physical wheel.
- **Seamless Fullscreen Transitions (FLIP)**: Using Framer Motion's `layoutId`, cards physically detach from the carousel and interpolate into the center of the screen seamlessly.
- **Lighting Reaction**: A glowing spotlight tracks your cursor exactly across the surface of the polaroids.

### IV. The Confessions Wall (Psychological Physics)
- **Dynamic Shadow Casting**: The sticky notes act as physical 3D objects, casting inverted drop shadows that continuously recalculate based on the global position of your cursor (your mouse is the light source).
- **Tear-off Physics**: You can click and drag confessions. Pulling them beyond 150 pixels "rips" them off the wall, dropping them into the void.
- **Ink Bleed Aesthetics**: A custom SVG `<feTurbulence>` filter is applied to the typography, causing the text to subtly wobble and bleed, mimicking wet ink on cotton paper.

### V. Poetry & Words (The Kinetic Overlay)
- **Physical Candlelight**: An absolute, radial WebGL-like gradient completely tracks your cursor, acting as a physical candle illuminating the dark poetry overlay.
- **Breathing Typography**: The poem titles infinitely and smoothly interpolate their `letterSpacing` and `textShadow`, simulating a living, breathing entity.
- **Smoke & Mask Stanza Entrance**: Lines of the poem emerge from a heavy blur (`filter: blur(8px)`) resolving down to `0px`, mimicking words pulling themselves out of a memory.

## Tech Stack
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, React 19)
- **Animations & Physics**: [Framer Motion](https://www.framer.com/motion/) (Spring physics, layout animations, drag)
- **Styling**: Vanilla CSS (`globals.css`), CSS Variables, CSS color-mix (Theme awareness)
- **Backend / Database**: [Firebase Firestore](https://firebase.google.com/) (Real-time live confessions stream)
- **Font Stack**: Bodoni Moda (Serif), Instrument Serif (Italics), Figtree (Sans-serif)
- **Performance**: Bare-metal Canvas API, hardware-accelerated CSS properties.

## Getting Started

First, install the dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to experience the installation.

## License
All personal assets (images, writing, audio) are strictly copyright to the creator. The underlying codebase architecture is proprietary.
