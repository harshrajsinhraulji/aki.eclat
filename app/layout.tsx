import type { Metadata } from 'next'
import './globals.css'
import { bodoniModa, figtree, instrumentSerif } from '@/lib/fonts'
import { LayoutClient } from './layout-client'
import { ThemeProvider } from '@/lib/ThemeContext'

export const metadata: Metadata = {
  metadataBase: new URL('https://aki-in-a-nutshell.web.app'),
  title: {
    default: "Aki's World — Interior Design · Psychology · Diamond 1",
    template: "%s — Aki's World",
  },
  description:
    "Step into Aki's world. Sri Lankan blood, London soul. Interior design student, psychology devotee, Diamond 1 carry. aneh, I'm just a girl 🎀",
  keywords: [
    'Aki',
    'aki.eclat',
    'interior design',
    'psychology',
    'personal website',
    'Sri Lanka',
    'London',
    'League of Legends',
    'Diamond 1',
    'confessions',
  ],
  openGraph: {
    title: "Aki's World",
    description: "aneh, I'm just a girl 🎀",
    type: 'website',
    url: 'https://aki-in-a-nutshell.web.app',
    siteName: "Aki's World",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: "Aki's World — AKI wordmark on deep pink",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Aki's World",
    description: "aneh, I'm just a girl 🎀",
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${bodoniModa.variable} ${figtree.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* Anti-FOUC: set data-theme synchronously before paint to prevent flash of wrong theme.
            Must be the first thing in body so it runs before any CSS-dependent rendering. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('aki-theme');
                  if (saved) {
                    document.documentElement.setAttribute('data-theme', saved);
                  } else {
                    var hour = new Date().getHours();
                    var theme = 'midnight';
                    if (hour >= 5 && hour < 10) theme = 'dawn';
                    else if (hour >= 10 && hour < 17) theme = 'noon';
                    else if (hour >= 17 && hour < 20) theme = 'dusk';
                    document.documentElement.setAttribute('data-theme', theme);
                  }
                } catch(e) {
                  document.documentElement.setAttribute('data-theme', 'noon');
                }
              })()
            `
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              'name': 'Aki',
              'url': 'https://aki-in-a-nutshell.web.app',
              'sameAs': [
                'https://discord.com/users/aki.eclat',
              ],
              'jobTitle': 'Interior Designer & Cognitive Psychology Student',
              'knowsAbout': ['Interior Design', 'Cognitive Psychology', 'League of Legends'],
            }),
          }}
        />
        <ThemeProvider>
          <LayoutClient>{children}</LayoutClient>
        </ThemeProvider>
      </body>
    </html>
  )
}
