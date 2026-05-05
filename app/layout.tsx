import type { Metadata } from 'next'
import './globals.css'
import { bodoniModa, figtree, instrumentSerif } from '@/lib/fonts'
import { LayoutClient } from './layout-client'

export const metadata: Metadata = {
  title: "Aki's World — Interior Design · Psychology · Diamond 1",
  description:
    "Step into Aki's world. Sri Lankan blood, London upbringing. Interior design student, psychology devotee, Diamond 1 carry. aneh, I'm just a girl 🎀",
  keywords: [
    'Aki',
    'interior design',
    'psychology',
    'personal website',
    'Sri Lanka',
    'London',
    'League of Legends',
    'Diamond 1',
  ],
  openGraph: {
    title: "Aki's World",
    description: "aneh, I'm just a girl 🎀",
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Aki's World",
    description: "aneh, I'm just a girl 🎀",
  },
  robots: {
    index: true,
    follow: true,
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
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  )
}
