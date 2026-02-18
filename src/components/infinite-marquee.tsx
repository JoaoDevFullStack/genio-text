"use client"

interface MarqueeProps {
  items: string[]
  speed?: number
  reverse?: boolean
}

export function InfiniteMarquee({ items, speed = 30, reverse = false }: MarqueeProps) {
  const duplicatedItems = [...items, ...items]

  return (
    <div className="relative overflow-hidden py-4 group">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

      <div
        className={`flex gap-8 ${reverse ? "animate-marquee-reverse" : "animate-marquee"} group-hover:[animation-play-state:paused]`}
        style={{ animationDuration: `${speed}s` }}
      >
        {duplicatedItems.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-6 py-3 rounded-full bg-white/[0.03] border border-white/[0.06] whitespace-nowrap hover:border-primary/30 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
