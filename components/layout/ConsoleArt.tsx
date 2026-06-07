'use client'

import { useEffect } from 'react'

export function ConsoleArt() {
  useEffect(() => {
    // Only run once in production or dev
    if (typeof window === 'undefined') return
    
    // Prevent double logging in React Strict Mode
    if ((window as any).__CONSOLE_ART_LOADED__) return
    ;(window as any).__CONSOLE_ART_LOADED__ = true

    const ascii = `
      ___           ___           ___     
     /\\  \\         /\\__\\         /\\  \\    
    /::\\  \\       /:/  /        \\:\\  \\   
   /:/\\:\\  \\     /:/__/          \\:\\  \\  
  /::\\~\\:\\  \\   /::\\__\\____      /::\\  \\ 
 /:/\\:\\ \\:\\__\\ /:/\\:::::\\__\\    /:/\\:\\__\\
 \\/__\\:\\ \\/__/ \\/_|:|~~|~       \\/__\\/__/
      \\:\\__\\      |:|  |                 
       \\/__/      |:|  |                 
                  \\|__|                 
                                         
    `
    
    const signature = "SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"

    console.log(
      '%c' + ascii,
      'color: #E91E63; font-weight: bold;'
    )
    
    console.log(
      '%c[AKI_CORE] Architecture Initialised.',
      'color: #FFFFFF; background: #150408; padding: 4px 8px; border-radius: 4px; font-weight: bold;'
    )
    
    console.log(
      '%cSignature Verified: %c' + signature,
      'color: #C9A465; font-weight: bold;',
      'color: #666666;'
    )

  }, [])

  return null
}
