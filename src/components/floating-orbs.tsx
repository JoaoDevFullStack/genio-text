"use client"

import { useEffect, useState } from "react"

interface Orb {
  id: number
  x: number
  y: number
  size: number
  color: string
}

export function FloatingOrbs() {
  const [orbs, setOrbs] = useState<Orb[]>([])

  useEffect(() => {
    const colors = ["from-primary/10 to-primary/5", "from-accent/10 to-accent/5", "from-primary/8 to-accent/5"]

    const newOrbs: Orb[] = Array.from({ length: 3 }, (_, i) => ({
      id: i,
      x: 20 + i * 30,
      y: 20 + i * 25,
      size: 300 + i * 100,
      color: colors[i % colors.length],
    }))

    setOrbs(newOrbs)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {orbs.map((orb) => (
        <div
          key={orb.id}
          className={`absolute rounded-full bg-gradient-radial ${orb.color} blur-3xl opacity-50`}
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: orb.size,
            height: orb.size,
          }}
        />
      ))}
    </div>
  )
}
