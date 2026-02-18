"use client"

import type { ReactNode } from "react"

interface BentoItem {
  title: string
  description: string
  icon: ReactNode
  className?: string
  gradient?: string
}

interface BentoGridProps {
  items: BentoItem[]
}

export function BentoGrid({ items }: BentoGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
      {items.map((item, i) => (
        <div key={i} className={item.className || ""}>
          <div
            className="relative h-full p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm overflow-hidden group hover:border-primary/30 transition-colors duration-300 min-h-[200px]"
          >
            {/* Background gradient */}
            <div
              className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                item.gradient || "bg-gradient-to-br from-primary/10 via-transparent to-accent/10"
              }`}
            />

            <div className="relative z-10 h-full flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-white/[0.08] flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="font-bold mb-2 text-foreground tracking-tight text-lg">
                {item.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{item.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
