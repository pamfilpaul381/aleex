import { motion } from 'framer-motion'

export default function HeatmapCalendar({ sessions = [] }) {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()

  // Aggregate minutes per day
  const dayMinutes = {}
  sessions.forEach(s => {
    const d = new Date(s.created_at)
    if (d.getMonth() === month && d.getFullYear() === year) {
      const key = d.getDate()
      dayMinutes[key] = (dayMinutes[key] || 0) + (s.duration_minutes || 0)
    }
  })

  const maxMin = Math.max(...Object.values(dayMinutes), 1)
  const monthName = today.toLocaleString('default', { month: 'long', year: 'numeric' })

  const cells = []
  // Empty cells for alignment
  for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
    cells.push(<div key={`empty-${i}`} className="w-8 h-8" />)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const mins = dayMinutes[day] || 0
    const intensity = mins > 0 ? Math.max(0.2, mins / maxMin) : 0
    const isToday = day === today.getDate()

    cells.push(
      <motion.div
        key={day}
        className={`w-8 h-8 rounded-md flex items-center justify-center text-[10px] font-mono ${
          isToday ? 'ring-1 ring-velvet-light' : ''
        }`}
        style={{
          background: mins > 0
            ? `rgba(139, 34, 82, ${intensity})`
            : 'rgba(255,255,255,0.03)',
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: day * 0.02 }}
      >
        <span className="text-cream/50">{day}</span>
      </motion.div>
    )
  }

  return (
    <div>
      <h3 className="text-cream/70 font-body text-sm text-center mb-3">{monthName}</h3>
      <div className="grid grid-cols-7 gap-1 justify-items-center">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <div key={i} className="w-8 h-6 flex items-center justify-center text-[10px] text-cream/30 font-body">
            {d}
          </div>
        ))}
        {cells}
      </div>
    </div>
  )
}
