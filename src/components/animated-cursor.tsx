"use client"

import { useEffect, useState } from "react"

export function AnimatedCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isPointer, setIsPointer] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)

      const target = e.target as HTMLElement
      setIsPointer(
        window.getComputedStyle(target).cursor === "pointer" || target.tagName === "BUTTON" || target.tagName === "A",
      )
    }

    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    window.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseenter", handleMouseEnter)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseenter", handleMouseEnter)
    }
  }, [])

  return (
    <>
      {/* Main cursor */}
      <div
        className="fixed pointer-events-none z-[9999] hidden md:block transition-transform duration-100 ease-out"
        style={{
          left: position.x,
          top: position.y,
          transform: `translate(-50%, -50%) scale(${isPointer ? 1.5 : 1})`,
        }}
      >
        <div
          className={`w-4 h-4 rounded-full bg-primary/80 transition-all duration-200 ${
            isPointer ? "opacity-50" : "opacity-100"
          } ${isVisible ? "scale-100" : "scale-0"}`}
        />
      </div>
      {/* Trail */}
      <div
        className="fixed pointer-events-none z-[9998] hidden md:block transition-all duration-300 ease-out"
        style={{
          left: position.x,
          top: position.y,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          className={`w-10 h-10 rounded-full border border-primary/30 transition-all duration-300 ${
            isPointer ? "scale-150 border-accent/50" : "scale-100"
          } ${isVisible ? "opacity-100" : "opacity-0"}`}
        />
      </div>
    </>
  )
}
