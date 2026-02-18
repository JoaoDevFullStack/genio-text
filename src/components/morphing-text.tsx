"use client"

import { useEffect, useState } from "react"

const words = ["extraordinário", "incrível", "brilhante", "impactante", "memorável"]

export function MorphingText() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length)
        setIsAnimating(false)
      }, 400)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <span className="relative inline-block min-w-[280px] md:min-w-[380px]">
      <span
        className={`inline-block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent transition-opacity duration-400 ${
          isAnimating ? "opacity-0" : "opacity-100"
        }`}
      >
        {words[currentIndex]}
      </span>
    </span>
  )
}
