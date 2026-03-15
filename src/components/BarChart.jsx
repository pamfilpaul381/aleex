import { motion } from 'framer-motion'

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function BarChart({ data = [] }) {
  const maxMinutes = Math.max(...data.map(d => d.minutes), 1)

  return (
    <div className="flex items-end justify-center gap-3 h-40">
      {data.map((day, i) => {
        const height = (day.minutes / maxMinutes) * 120
        return (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className="text-[10px] text-cream/50 font-mono">{day.minutes}m</span>
            <motion.div
              className="w-8 rounded-t-lg"
              style={{
                background: day.minutes > 0
                  ? 'linear-gradient(to top, #8B2252, #7B3FA0)'
                  : 'rgba(255,255,255,0.06)',
                minHeight: 4,
              }}
              initial={{ height: 0 }}
              animate={{ height: Math.max(height, 4) }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: 'easeOut' }}
            />
            <span className="text-[10px] text-cream/40 font-body">
              {dayNames[day.date.getDay()]}
            </span>
          </div>
        )
      })}
    </div>
  )
}
