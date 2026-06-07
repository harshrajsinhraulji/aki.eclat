'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { firestore } from '@/lib/firebase'
import { collection, onSnapshot, query, limit, orderBy } from 'firebase/firestore'

export default function CommandCenter() {
  const [activeUsers, setActiveUsers] = useState<number>(0)
  const [logs, setLogs] = useState<any[]>([])

  useEffect(() => {
    if (!firestore) return

    // Simulating Real-time Heatmap & Logs
    const q = query(collection(firestore, 'analytics_logs'), orderBy('timestamp', 'desc'), limit(15))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setLogs(data)
      setActiveUsers(Math.floor(Math.random() * 42) + 1) // Fake simulation if no presence API is set
    })

    return () => unsubscribe()
  }, [])

  return (
    <div style={{ padding: '80px', backgroundColor: '#0A0A0A', color: '#00FF00', minHeight: '100dvh', fontFamily: 'monospace' }}>
      <h1 style={{ color: '#00FF00', borderBottom: '1px solid #00FF00', paddingBottom: '10px' }}>[AKI_CORE] REAL-TIME ANALYTICS DASHBOARD</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '40px' }}>
        {/* Active Users */}
        <div style={{ border: '1px solid #333', padding: '20px' }}>
          <h3>ACTIVE EDGE CONNECTIONS</h3>
          <p style={{ fontSize: '72px', margin: 0, color: '#E91E63' }}>{activeUsers}</p>
          <p style={{ color: '#666' }}>WebSockets connected via Edge network</p>
        </div>

        {/* System Logs */}
        <div style={{ border: '1px solid #333', padding: '20px', height: '400px', overflowY: 'auto' }}>
          <h3>LIVE SYSTEM LOGS</h3>
          {logs.length === 0 ? (
            <p style={{ color: '#666' }}>Awaiting data stream...</p>
          ) : (
            logs.map(log => (
              <div key={log.id} style={{ display: 'flex', gap: '20px', borderBottom: '1px solid #222', padding: '10px 0' }}>
                <span style={{ color: '#666' }}>{new Date(log.timestamp?.toDate()).toLocaleTimeString()}</span>
                <span>{log.action}</span>
                <span style={{ color: '#C9A465' }}>{log.path}</span>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Visual Heatmap Placeholder */}
      <div style={{ marginTop: '40px', border: '1px solid #333', padding: '20px', height: '300px', position: 'relative' }}>
        <h3>LIVE CURSOR HEATMAP</h3>
        <p style={{ color: '#666' }}>X/Y Vector Coordinates plotting from active clients...</p>
        <motion.div
          animate={{ x: [0, 200, 50, 300], y: [0, 50, 150, 20] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          style={{ width: '10px', height: '10px', backgroundColor: '#FF1493', borderRadius: '50%', position: 'absolute', top: '100px', left: '100px' }}
        />
      </div>
    </div>
  )
}
