import { ConfessionsWall } from '@/components/confessions/ConfessionsWall'

export const metadata = {
  title: 'Confessions — Aki\'s World',
  description: 'Spill. I\'m listening.',
}

export default function ConfessionsPage() {
  return (
    <main
      style={{
        minHeight: '100svh',
        background: 'var(--bg-primary)',
        transition: 'background 400ms ease',
        position: 'relative',
        paddingTop: '120px',
        paddingBottom: '120px',
        overflow: 'hidden',
      }}
    >
      <ConfessionsWall />
    </main>
  )
}
