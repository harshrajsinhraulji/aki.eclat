'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useRef } from 'react'

const POEMS = [
  {
    title: 'Apartment',
    date: '29.01.26',
    author: 'Aki Liya',
    content: `At night the apartment feels alive.

I hear footsteps overhead
someone walking back and forth,
like they forgot what they went into the room for.

I’m on the couch, a movie playing,
not really watching it,
just letting the light move across the walls
and wondering what everyone else is up to.

Maybe someone’s making lunch
even though it’s late,
opening the fridge three times,
standing there deciding if it’s worth it.

Maybe someone’s doing laundry,
machines shaking the floor a little,
clothes tumbling around
while they scroll on their phone.

Maybe one apartment is empty tonight
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
I’m not the only one awake.`
  },
  {
    title: 'Rain',
    date: '23.12.25',
    author: 'Aki Liya',
    content: `I saw the rain pouring down the window, blurring the city lights into streaks.
I heard it battering the roof, drowning out everything else.

I saw my neighbor across the way, curtains half drawn, screaming.
I couldn’t hear him the rain was too loud—just the shape of his mouth, wide and desperate.

I saw flashes of light from his apartment.
I heard gunshots, sharp and echoing through the complex.

I saw my own reflection shaking as I locked the front door.
I heard my breath coming out uneven, quick, like the air was running out.

I went into the bathroom, trying to calm down.
I heard a second series of shots—slower this time, spaced out, like someone counting.

I saw my phone screen light up with the news.
I heard the reporter’s voice say it was just a wild animal, a government-controlled hunting test.
I saw the message urging everyone to stay calm, to ignore the noise.
I knew it wasn’t true.

I heard a bang on my bathroom door.
I saw the handle twist, slow, shaking.
I heard my neighbor’s voice hoarse, broken—calling for help.
I saw his shadow through the crack at the bottom of the door.
I peeped through the keyhole.
I saw his eye staring back.

I heard the gunshot.
I saw him fall against the door.
I heard nothing after that—just rain and silence.

I saw the Uber pull up outside on my phone screen.
I peeped through the keyhole again.
I heard only the rain, steady and cold.
I saw nothing.
The body was gone. Nobody was there.

I saw the lights of the car waiting below.
I heard the city hum like nothing had happened.
I grabbed my bag, heart pounding, and walked out.
I didn’t look back.`
  }
]

export default function WritingsPage() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])

  return (
    <main ref={containerRef} style={{ minHeight: '100vh', background: 'var(--bg-primary)', transition: 'background 400ms ease', position: 'relative', overflow: 'hidden' }}>
      
      {/* Editorial Watermark */}
      <motion.div style={{
        position: 'fixed',
        top: '10vh',
        left: '-5vw',
        fontFamily: 'var(--font-bodoni-moda)',
        fontSize: '40vw',
        color: 'rgba(255,20,147,0.02)',
        lineHeight: 0.8,
        letterSpacing: '-0.05em',
        pointerEvents: 'none',
        zIndex: 0,
        y: yBg,
      }}>
        writings
      </motion.div>

      {/* Elegant Nav */}
      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        padding: '40px clamp(24px, 5vw, 80px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 50,
      }}>
        <Link href="/#art" style={{
          fontFamily: 'var(--font-figtree)',
          fontSize: '12px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          color: 'var(--text-primary)',
          transition: 'color 400ms ease',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ display: 'inline-block', width: '32px', height: '1px', background: 'var(--text-primary)', transition: 'background 400ms ease' }} />
          Return
        </Link>
        <div style={{
          fontFamily: 'var(--font-instrument-serif)',
          fontStyle: 'italic',
          fontSize: '18px',
          color: 'var(--text-primary)',
          transition: 'color 400ms ease',
        }}>
          Aki Liya
        </div>
      </nav>

      {/* Hero Title */}
      <div style={{
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingLeft: 'clamp(24px, 10vw, 120px)',
        position: 'relative',
        zIndex: 10
      }}>
        <motion.h1 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-bodoni-moda)',
            fontSize: 'clamp(64px, 12vw, 160px)',
            color: 'var(--text-primary)',
            transition: 'color 400ms ease',
            letterSpacing: '-0.03em',
            lineHeight: 0.9,
          }}
        >
          Inner
          <br />
          <span style={{
            fontFamily: 'var(--font-instrument-serif)',
            fontStyle: 'italic',
            color: '#FF1493',
            marginLeft: 'clamp(40px, 8vw, 120px)'
          }}>
            monologue.
          </span>
        </motion.h1>
      </div>

      {/* Poems Feed */}
      <div style={{ position: 'relative', zIndex: 10, paddingBottom: '20vh' }}>
        {POEMS.map((poem, idx) => (
          <article 
            key={idx}
            style={{
              padding: 'clamp(80px, 15vh, 200px) clamp(24px, 10vw, 120px)',
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gap: '24px',
              borderTop: idx === 0 ? '1px solid var(--card-border)' : 'none',
              position: 'relative'
            }}
          >
            {/* Meta Left Column */}
            <div style={{
              gridColumn: '1 / span 3',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-20%' }}
                transition={{ duration: 0.6 }}
              >
                <div style={{
                  fontFamily: 'var(--font-figtree)',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.2em',
                  color: 'var(--text-soft)',
                  transition: 'color 400ms ease',
                  textTransform: 'uppercase',
                  marginBottom: '24px'
                }}>
                  {String(idx + 1).padStart(2, '0')} — {poem.date}
                </div>
                <h2 style={{
                  fontFamily: 'var(--font-instrument-serif)',
                  fontStyle: 'italic',
                  fontSize: 'clamp(32px, 4vw, 56px)',
                  color: '#FF1493',
                  lineHeight: 1.1
                }}>
                  {poem.title}
                </h2>
              </motion.div>
            </div>

            {/* Content Right Column */}
            <div style={{
              gridColumn: '5 / span 7',
            }}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20%' }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: 'var(--font-figtree)',
                  fontSize: 'clamp(16px, 1.8vw, 20px)',
                  lineHeight: 1.8,
                  color: 'var(--text-primary)',
                  transition: 'color 400ms ease',
                  fontWeight: 300,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {/* Drop cap styling for the first letter */}
                <span style={{
                  float: 'left',
                  fontFamily: 'var(--font-bodoni-moda)',
                  fontSize: '84px',
                  lineHeight: '60px',
                  paddingTop: '8px',
                  paddingRight: '12px',
                  color: '#FF1493',
                }}>
                  {poem.content.charAt(0)}
                </span>
                {poem.content.slice(1)}
              </motion.div>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}
