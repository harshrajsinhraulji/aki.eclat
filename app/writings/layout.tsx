import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Writings — Aki's World",
  description:
    'Poems written at 2am. In Urdu, in English, in the language between sleep and awareness. Dropping soon.',
  openGraph: {
    title: "Writings — Aki's World",
    description: 'In Urdu, in English, in the language between sleep and awareness.',
    type: 'website',
  },
}

export default function WritingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
