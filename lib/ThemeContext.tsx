'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type Theme = 'dawn' | 'noon' | 'dusk' | 'midnight'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('noon')

  useEffect(() => {
    const savedTheme = localStorage.getItem('aki-theme') as Theme | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    } else {
      const hour = new Date().getHours()
      let currentTheme: Theme = 'midnight'
      if (hour >= 5 && hour < 10) currentTheme = 'dawn'
      else if (hour >= 10 && hour < 17) currentTheme = 'noon'
      else if (hour >= 17 && hour < 20) currentTheme = 'dusk'
      
      setTheme(currentTheme)
      document.documentElement.setAttribute('data-theme', currentTheme)
    }
  }, [])

  const toggleTheme = () => {
    const sequence: Theme[] = ['dawn', 'noon', 'dusk', 'midnight']
    const nextIdx = (sequence.indexOf(theme) + 1) % sequence.length
    const nextTheme = sequence[nextIdx]
    setTheme(nextTheme)
    localStorage.setItem('aki-theme', nextTheme)
    document.documentElement.setAttribute('data-theme', nextTheme)
    window.dispatchEvent(new CustomEvent('aki-theme-change', { detail: nextTheme }))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
