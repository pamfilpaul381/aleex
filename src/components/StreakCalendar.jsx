import { motion } from 'framer-motion'

const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function StreakCalendar({ days = [] }) {
  return (
    <div className="flex justify-center gap-3 mt-3">
      {days.map((day, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <motion.div
            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              day.done
                ? 'bg-velvet-light border-velvet-light'
                : day.isToday
                ? 'border-velvet-light bg-transparent'
                : 'border-cream/20 bg-transparent'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.08, type: 'spring', stiffness: 200 }}
            {...(day.isToday && !day.done ? {
              style: { boxShadow: '0 0 8px rgba(194,24,91,0.5)' },
            } : {})}
          >
            {day.done && (
              <motion.div
                className="w-2 h-2 rounded-full bg-cream"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.08 + 0.1 }}
              />
            )}
          </motion.div>
          <span className="text-[10px] text-cream/40 font-body">
            {dayLabels[(day.date.getDay() + 6) % 7]}
          </span>
        </div>
      ))}
    </div>
  )
}
