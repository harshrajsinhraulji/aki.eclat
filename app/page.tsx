import dynamic from 'next/dynamic'
import { Hero } from '@/components/sections/Hero'

/**
 * app/page.tsx — Server Component
 * Aki's World — Complete section flow
 *
 * Hero: statically imported (above the fold, never flashes)
 * Sections: dynamic() with ssr:true for code splitting without flash
 *
 * NOTE: ssr:false is not allowed in Server Components (Next.js 15).
 * We use ssr:true (default) to get code splitting while still SSR-ing.
 * The real performance win is chunk splitting, not SSR bypass.
 */

const Coconut = dynamic(() =>
  import('@/components/sections/Coconut').then((m) => ({ default: m.Coconut }))
)
const Universe = dynamic(() =>
  import('@/components/sections/Universe').then((m) => ({ default: m.Universe }))
)
const InfiniteCloset = dynamic(() =>
  import('@/components/sections/InfiniteCloset').then((m) => ({ default: m.InfiniteCloset }))
)
const ArtWords = dynamic(() =>
  import('@/components/sections/ArtWords').then((m) => ({ default: m.ArtWords }))
)
const PlushieGang = dynamic(() =>
  import('@/components/sections/PlushieGang').then((m) => ({ default: m.PlushieGang }))
)
const ConfessionsTeaser = dynamic(() =>
  import('@/components/sections/ConfessionsTeaser').then((m) => ({ default: m.ConfessionsTeaser }))
)
const LetsTalk = dynamic(() =>
  import('@/components/sections/LetsTalk').then((m) => ({ default: m.LetsTalk }))
)

export default function HomePage() {
  return (
    <>
      {/* Phase 1 — Hero: eagerly rendered, above fold */}
      <Hero />

      {/* Phase 2 — Below fold: correct narrative flow
          Blush world: Hero → About → [dark: Universe] → Closet → Art → Plushies
          Dark peaks:  Confessions → Contact
          Blush close: Footer (in layout-client)
      */}
      <Coconut />
      <Universe />
      <InfiniteCloset />
      <ArtWords />
      <PlushieGang />
      <ConfessionsTeaser />
      <LetsTalk />
    </>
  )
}
