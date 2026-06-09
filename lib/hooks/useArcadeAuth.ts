import { useState, useEffect } from 'react'

export function useArcadeAuth() {
  const [uid, setUid] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Pure local fallback mechanism to avoid Firebase 'admin-restricted-operation' dev overlay
    let localUid = localStorage.getItem('arcade_fallback_uid')
    if (!localUid) {
      localUid = `local_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('arcade_fallback_uid', localUid)
    }
    setUid(localUid)
    
    const savedName = localStorage.getItem(`arcade_username_${localUid}`)
    if (savedName) setUsername(savedName)
    
    setLoading(false)
  }, [])

  const claimUsername = (newUsername: string) => {
    if (!uid) return
    localStorage.setItem(`arcade_username_${uid}`, newUsername)
    setUsername(newUsername)
  }

  return { uid, username, claimUsername, loading }
}
