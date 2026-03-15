import { motion } from 'framer-motion'

export default function ProgressRing({ current, goal, size = 160 }) {
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(current / goal, 1)
  const offset = circumference * (1 - progress)

  const getMotivation = () => {
    const pct = progress * 100
    if (pct >= 100) return "GOAL CRUSHED. You absolute legend."
    if (pct >= 75) return "The finish line is calling your name!"
    if (pct >= 50) return "Past the halfway mark. Unstoppable."
    if (pct >= 30) return "Almost halfway! Your body is thanking you."
    if (pct >= 10) return "Building momentum. You can feel it."
    return "Just getting started. Every minute counts."
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={strokeWidth}
          />
          {/* Progress ring */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B2252" />
              <stop offset="100%" stopColor="#7B3FA0" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-2xl font-bold text-cream">{current}</span>
          <span className="text-cream/50 text-xs font-body">/ {goal} min</span>
        </div>
      </div>
      <p className="text-cream/60 text-sm font-body mt-2 text-center max-w-[200px]">
        {getMotivation()}
      </p>
    </div>
  )
}
