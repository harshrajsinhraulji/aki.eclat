'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRef, useState } from 'react'

/**
 * app/writings/page.tsx
 * Rebuilt to homepage standard.
 *
 * Sections: Hero intro → Poem cards (large editorial, expandable in-place) 
 * Typography: Bodoni headings, Instrument Serif poem body, Figtree metadata
 * Colour: blush #FFF5F8 canvas, hot pink accents, deep plum text
 * Poems: click card → layoutId expansion → full poem revealed in place
 * Reading time: dynamically calculated per poem
 */

const POEMS = [
  {
    id: 'apartment',
    title: 'Apartment',
    date: '29.01.26',
    teaser: 'At night the apartment feels alive.\nI hear footsteps overhead —',
    content: `At night the apartment feels alive.
I hear footsteps overhead —
someone walking back and forth,
like they forgot what they went into the room for.

I'm on the couch, a movie playing,
not really watching it,
just letting the light move across the walls
and wondering what everyone else is up to.

Maybe someone's making lunch
even though it's late,
opening the fridge three times,
standing there deciding if it's worth it.

Maybe someone's doing laundry,
machines shaking the floor a little,
clothes tumbling around
while they scroll on their phone.

Maybe one apartment is empty tonight —
no lights on, no noise,
just a quiet space
waiting for someone to come back.

I hear a laugh through the wall,
a door slam,
something dropped on the floor.
Life, happening, casually.

All of us stacked together,
separate but close,
living our small moments at the same time.

The movie keeps playing.
The footsteps move on.
And for a while,
it feels nice knowing
I'm not the only one awake.`,
  },
  {
    id: 'rain',
    title: 'Rain',
    date: '23.12.25',
    teaser: 'I saw the rain pouring down the window,\nblurring the city lights into streaks —',
    content: `I saw the rain pouring down the window,
blurring the city lights into streaks
of something almost beautiful.

Almost.

That's the word for most things
I can't hold onto.

I saw my neighbor across the way, curtains half drawn.
I couldn't hear him — the rain was too loud —
just the shape of his mouth, wide and desperate.

I saw my own reflection shaking
as I locked the front door.

I heard my breath coming out uneven, quick,
like the air was running out.

I heard a bang on my bathroom door.
I saw the handle twist, slow, shaking.
I heard my neighbor's voice —
hoarse, broken — calling for help.

I peeped through the keyhole.
I saw his eye staring back.

I heard the gunshot.
I saw him fall against the door.
I heard nothing after that —
just rain and silence.

Nobody was there.
I grabbed my bag, heart pounding, and walked out.
I didn't look back.`,
  },
  {
    id: 'canvas',
    title: 'Canvas',
    date: '14.01.26',
    teaser: "The painting was finished at 2am.\nIt wasn't good. I loved it anyway.",
    content: `The painting was finished at 2am.
It wasn't good. I loved it anyway.

There is something about making things at 2am
that lowers the stakes.

The world is asleep.
Nobody is watching.
The light in the room is warm and a little tired,
like you.

I mixed the pink too bright
and the gold too loud
and the whole thing looks like something
a child would make —
sure of themselves,
not yet self-conscious.

I taped it to the wall anyway.

In the morning it looked exactly the same.
Still too bright. Still too loud.
Still the truest thing I'd made all week.`,
  },
]

function readingTime(text: string) {
  const wpm = 200
  const words = text.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wpm)
  return `${minutes} min read`
}

function PoemCard({ poem, index }: { poem: (typeof POEMS)[0]; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.article
      layout
      onClick={() => setIsExpanded(!isExpanded)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
      style={{
        background: isExpanded ? '#FFFFFF' : 'rgba(255,255,255,0.5)',
        border: `1px solid ${isExpanded ? 'rgba(233,30,99,0.25)' : 'rgba(233,30,99,0.10)'}`,
        borderRadius: '24px',
        padding: 'clamp(32px, 5vw, 56px)',
        cursor: isExpanded ? 'default' : 'pointer',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: isExpanded
          ? '0 32px 80px rgba(233,30,99,0.12)'
          : '0 4px 20px rgba(233,30,99,0.06)',
        transition: 'box-shadow 400ms ease, border-color 300ms ease, background 300ms ease',
      }}
    >
      {/* Hover shimmer on collapsed cards */}
      {!isExpanded && (
        <motion.div
          whileHover={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 50% 0%, rgba(233,30,99,0.05) 0%, transparent 70%)',
            pointerEvents: 'none',
            borderRadius: '24px',
          }}
        />
      )}

      {/* Card header — always visible */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-figtree)',
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#A8627A',
            marginBottom: '10px',
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
          }}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <span>·</span>
            <span>{poem.date}</span>
            <span>·</span>
            <span>{readingTime(poem.content)}</span>
          </div>
          <motion.h2
            layout="position"
            style={{
              fontFamily: 'var(--font-bodoni-moda)',
              fontSize: 'clamp(32px, 5vw, 60px)',
              color: '#1A0A12',
              letterSpacing: '-0.025em',
              lineHeight: 1.05,
            }}
          >
            {poem.title}
          </motion.h2>
        </div>

        {/* Expand / collapse indicator */}
        <motion.div
          animate={{ rotate: isExpanded ? 45 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            border: '1px solid rgba(233,30,99,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#E91E63',
            fontSize: '22px',
            flexShrink: 0,
            marginTop: '4px',
            background: isExpanded ? 'rgba(233,30,99,0.08)' : 'transparent',
            transition: 'background 300ms ease',
          }}
        >
          +
        </motion.div>
      </div>

      {/* Teaser — only visible when collapsed */}
      <AnimatePresence initial={false}>
        {!isExpanded && (
          <motion.p
            key="teaser"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              fontFamily: 'var(--font-instrument-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(17px, 1.8vw, 21px)',
              color: '#6B2D4A',
              lineHeight: 1.65,
              whiteSpace: 'pre-line',
            }}
          >
            {poem.teaser}
            <span style={{ color: 'rgba(107,45,74,0.4)' }}> …</span>
          </motion.p>
        )}
      </AnimatePresence>

      {/* Full poem — only visible when expanded */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="full"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            {/* Drop cap first letter */}
            <div
              style={{
                fontFamily: 'var(--font-instrument-serif)',
                fontSize: 'clamp(17px, 1.8vw, 22px)',
                color: '#1A0A12',
                lineHeight: 1.85,
                fontWeight: 300,
                maxWidth: '68ch',
              }}
            >
              <span style={{
                float: 'left',
                fontFamily: 'var(--font-bodoni-moda)',
                fontSize: 'clamp(60px, 8vw, 90px)',
                lineHeight: '68px',
                paddingTop: '6px',
                paddingRight: '12px',
                color: '#E91E63',
              }}>
                {poem.content.charAt(0)}
              </span>
              {poem.content.slice(1).split('\n').map((line, i) => (
                line === ''
                  ? <br key={i} />
                  : <span key={i} style={{ display: 'block' }}>{line}</span>
              ))}
            </div>

            {/* Close hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{
                marginTop: '40px',
                fontFamily: 'var(--font-figtree)',
                fontSize: '11px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(168,98,122,0.6)',
                cursor: 'pointer',
              }}
              onClick={() => setIsExpanded(false)}
            >
              ↑ close
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}

export default function WritingsPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <main style={{
      minHeight: '100dvh',
      background: '#FFF5F8',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Grain texture — matches homepage */}
      <div style={{
        position: 'fixed',
        inset: 0,
        opacity: 0.022,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23g)' opacity='1'/%3E%3C/svg%3E\")",
        backgroundSize: '300px 300px',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* ── HERO ─────────────────────────────── */}
      <div
        ref={heroRef}
        style={{
          height: '90dvh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 'clamp(40px, 8vh, 80px) clamp(24px, 8vw, 100px)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ambient blush blob */}
        <motion.div
          style={{
            position: 'absolute',
            top: '10%', left: '60%',
            width: '50vw', height: '50vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,182,217,0.35) 0%, transparent 70%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
            y: heroY,
          }}
        />

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'absolute', top: 'clamp(24px, 5vh, 48px)', left: 'clamp(24px, 8vw, 100px)' }}
        >
          <Link href="/" style={{
            fontFamily: 'var(--font-figtree)',
            fontSize: '11px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: '#A8627A',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <span style={{ display: 'inline-block', width: '28px', height: '1px', background: '#A8627A' }} />
            aki&apos;s world
          </Link>
        </motion.div>

        {/* Large heading */}
        <motion.div
          style={{ position: 'relative', zIndex: 2, opacity: heroOpacity }}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{
            fontFamily: 'var(--font-figtree)',
            fontSize: '10px',
            fontWeight: 500,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#C2185B',
            marginBottom: '24px',
          }}>
            04 — Art & Words
          </div>
          <h1 style={{
            fontFamily: 'var(--font-bodoni-moda)',
            fontSize: 'clamp(60px, 11vw, 148px)',
            color: '#1A0A12',
            letterSpacing: '-0.03em',
            lineHeight: 0.92,
            marginBottom: '32px',
          }}>
            Words I<br />
            <span style={{
              fontFamily: 'var(--font-instrument-serif)',
              fontStyle: 'italic',
              color: '#E91E63',
              marginLeft: 'clamp(32px, 6vw, 100px)',
            }}>
              couldn&apos;t keep.
            </span>
          </h1>
          <p style={{
            fontFamily: 'var(--font-figtree)',
            fontWeight: 300,
            fontSize: 'clamp(15px, 1.4vw, 18px)',
            color: '#6B2D4A',
            maxWidth: '48ch',
            lineHeight: 1.65,
          }}>
            Written in English, in silence, at 2am. Click any piece to read it in full.
          </p>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            bottom: 'clamp(24px, 4vh, 40px)',
            right: 'clamp(24px, 8vw, 100px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div style={{ width: '1px', height: '48px', background: 'linear-gradient(to bottom, transparent, #E91E63)' }} />
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#E91E63' }} />
        </motion.div>
      </div>

      {/* ── POEMS FEED ──────────────────────── */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        padding: '0 clamp(24px, 8vw, 100px) clamp(80px, 15vh, 160px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(20px, 3vh, 28px)',
        maxWidth: '1100px',
        margin: '0 auto',
      }}>
        {POEMS.map((poem, i) => (
          <PoemCard key={poem.id} poem={poem} index={i} />
        ))}

        {/* Closing editorial note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{
            paddingTop: 'clamp(40px, 8vh, 80px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            textAlign: 'center',
          }}
        >
          <div style={{ width: '1px', height: '60px', background: 'linear-gradient(to bottom, #E91E63, transparent)' }} />
          <p style={{
            fontFamily: 'var(--font-instrument-serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(18px, 2vw, 26px)',
            color: '#6B2D4A',
            maxWidth: '40ch',
            lineHeight: 1.5,
          }}>
            More words, eventually. Right now this is all I have.
          </p>
          <Link href="/" style={{
            marginTop: '8px',
            fontFamily: 'var(--font-figtree)',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#E91E63',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <span style={{ display: 'inline-block', width: '24px', height: '1px', background: '#E91E63' }} />
            back to aki&apos;s world
            <span style={{ display: 'inline-block', width: '24px', height: '1px', background: '#E91E63' }} />
          </Link>
        </motion.div>
      </div>
    </main>
  )
}
