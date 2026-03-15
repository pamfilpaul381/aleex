import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Timer, BookOpen, BarChart3, Flame, Pencil, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { useStreak } from '../hooks/useStreak'
import { useProfile } from '../hooks/useProfile'
import Bloomie from '../components/Bloomie'
import GlassCard from '../components/GlassCard'
import ProgressRing from '../components/ProgressRing'
import PageTransition from '../components/PageTransition'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return "Good morning, Alexandra."
  if (hour >= 12 && hour < 17) return "Afternoon stretch break? Your body says yes."
  if (hour >= 17 && hour < 21) return "Wind down time. Stretch out the day."
  return "Late night stretcher? We love the dedication."
}

function MonthCalendar({ sessions = [], viewMonth, viewYear, onPrevMonth, onNextMonth }) {
  const today = new Date()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDay = new Date(viewYear, viewMonth, 1).getDay()

  const dayMinutes = {}
  sessions.forEach(s => {
    const d = new Date(s.started_at)
    if (d.getMonth() === viewMonth && d.getFullYear() === viewYear) {
      const key = d.getDate()
      dayMinutes[key] = (dayMinutes[key] || 0) + (s.duration_minutes || 0)
    }
  })

  const maxMin = Math.max(...Object.values(dayMinutes), 1)
  const monthName = new Date(viewYear, viewMonth).toLocaleString('default', { month: 'long', year: 'numeric' })
  const isCurrentMonth = viewMonth === today.getMonth() && viewYear === today.getFullYear()
  const canGoNext = !isCurrentMonth

  const emptyCells = []
  for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
    emptyCells.push(i)
  }

  const dayData = []
  for (let day = 1; day <= daysInMonth; day++) {
    const mins = dayMinutes[day] || 0
    const intensity = mins > 0 ? Math.max(0.25, mins / maxMin) : 0
    const isToday = day === today.getDate() && isCurrentMonth
    dayData.push({ day, mins, intensity, isToday })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={onPrevMonth} className="bg-transparent border-none cursor-pointer p-1">
          <ChevronLeft size={18} className="text-cream/50" />
        </button>
        <h3 className="text-cream/80 font-body text-sm font-semibold">{monthName}</h3>
        <button onClick={onNextMonth} disabled={!canGoNext} className="bg-transparent border-none cursor-pointer p-1 disabled:opacity-20">
          <ChevronRight size={18} className="text-cream/50" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <div key={i} className="w-full flex items-center justify-center text-[10px] text-cream/30 font-body py-1">
            {d}
          </div>
        ))}
        {emptyCells.map(i => (
          <div key={`empty-${i}`} className="w-full aspect-square" />
        ))}
        {dayData.map(({ day, mins, intensity, isToday }) => (
          <motion.div
            key={day}
            className={`w-full aspect-square rounded-lg flex flex-col items-center justify-center ${
              isToday ? 'ring-2 ring-velvet-light' : ''
            }`}
            style={{
              background: mins > 0
                ? `rgba(139, 34, 82, ${intensity})`
                : 'rgba(255,255,255,0.03)',
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: day * 0.015 }}
          >
            <span className={`text-[11px] font-mono ${mins > 0 ? 'text-cream' : 'text-cream/40'}`}>{day}</span>
            {mins > 0 && <span className="text-[8px] text-cream/60 font-body">{mins}m</span>}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

const bodyAreas = [
  { value: 'full_body', label: 'Full Body' },
  { value: 'upper', label: 'Upper Body' },
  { value: 'lower', label: 'Lower Body' },
]

const intensityOptions = [
  { value: 'light', label: 'Light', color: '#4ade80' },
  { value: 'moderate', label: 'Moderate', color: '#facc15' },
  { value: 'intense', label: 'Intense', color: '#f87171' },
]

function LogActivityModal({ onClose, onSave }) {
  const [minutes, setMinutes] = useState('')
  const [bodyArea, setBodyArea] = useState('full_body')
  const [intensity, setIntensity] = useState('moderate')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    const mins = parseInt(minutes)
    if (!mins || mins <= 0) return
    setSaving(true)
    try {
      await onSave({ durationMinutes: mins, bodyArea, intensity })
      onClose()
    } catch {
      setSaving(false)
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative w-full max-w-sm glass rounded-2xl p-6"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-lg font-bold text-cream">Log Activity</h3>
          <button onClick={onClose} className="bg-transparent border-none cursor-pointer p-1">
            <X size={20} className="text-cream/50" />
          </button>
        </div>

        <div className="mb-4">
          <label className="font-body text-cream/50 text-xs uppercase tracking-wider block mb-2">Duration (minutes)</label>
          <input
            type="number"
            inputMode="numeric"
            value={minutes}
            onChange={e => setMinutes(e.target.value)}
            placeholder="e.g. 15"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-cream font-mono text-center text-lg outline-none focus:border-velvet-light"
            autoFocus
          />
        </div>

        <div className="mb-4">
          <label className="font-body text-cream/50 text-xs uppercase tracking-wider block mb-2">Focus Area</label>
          <div className="grid grid-cols-3 gap-2">
            {bodyAreas.map(a => (
              <button
                key={a.value}
                onClick={() => setBodyArea(a.value)}
                className={`py-2.5 rounded-xl font-body text-xs border-none cursor-pointer transition-colors ${
                  bodyArea === a.value
                    ? 'bg-velvet-light text-cream'
                    : 'bg-white/5 text-cream/60'
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="font-body text-cream/50 text-xs uppercase tracking-wider block mb-2">Intensity</label>
          <div className="grid grid-cols-3 gap-2">
            {intensityOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setIntensity(opt.value)}
                className={`py-2.5 rounded-xl font-body text-xs border-none cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
                  intensity === opt.value
                    ? 'bg-velvet-light text-cream'
                    : 'bg-white/5 text-cream/60'
                }`}
              >
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: opt.color }} />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <motion.button
          onClick={handleSave}
          disabled={saving || !minutes}
          className="w-full py-3 rounded-xl font-body font-semibold text-cream border-none cursor-pointer min-h-[48px] disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #8B2252, #7B3FA0)' }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {saving ? 'Saving...' : 'Log Session'}
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { sessions, streak, totalMinutes, loading, logPastSession } = useStreak()
  const { profile, updateProfile } = useProfile()
  const [editingGoal, setEditingGoal] = useState(false)
  const [goalInput, setGoalInput] = useState('')
  const [showLogModal, setShowLogModal] = useState(false)
  const today = new Date()
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [viewYear, setViewYear] = useState(today.getFullYear())

  const goal = profile?.stretch_goal_minutes || 1000

  const handleGoalSave = async () => {
    const newGoal = parseInt(goalInput) || 1000
    if (newGoal > 0) {
      await updateProfile({ stretch_goal_minutes: newGoal })
    }
    setEditingGoal(false)
  }

  const handlePrevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1) }
    else setViewMonth(viewMonth - 1)
  }

  const handleNextMonth = () => {
    const now = new Date()
    const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1
    const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear
    if (nextYear < now.getFullYear() || (nextYear === now.getFullYear() && nextMonth <= now.getMonth())) {
      setViewMonth(nextMonth)
      setViewYear(nextYear)
    }
  }

  const activeDaysThisMonth = new Set(
    sessions
      .filter(s => {
        const d = new Date(s.started_at)
        return d.getMonth() === viewMonth && d.getFullYear() === viewYear
      })
      .map(s => new Date(s.started_at).getDate())
  ).size

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  if (loading) {
    return (
      <PageTransition>
        <div className="px-4 pt-6 pb-24 max-w-[480px] mx-auto">
          <div className="skeleton h-6 w-3/4 mb-6" />
          <div className="skeleton h-40 mb-4" />
          <div className="skeleton h-48 mb-4" />
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="px-4 pt-6 pb-24 max-w-[480px] mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <Bloomie state={streak > 0 ? 'idle' : 'sleeping'} size={40} />
          <p className="font-body text-cream/80 text-sm text-left">{getGreeting()}</p>
        </div>

        <GlassCard className="mb-4" delay={0}>
          <MonthCalendar
            sessions={sessions}
            viewMonth={viewMonth}
            viewYear={viewYear}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
            <span className="font-body text-cream/40 text-xs">
              {activeDaysThisMonth} of {daysInMonth} days active
            </span>
            <div className="flex items-center gap-2">
              {streak > 0 && <Flame className="text-velvet-light" size={14} />}
              <span className="font-mono text-cream text-sm font-bold">{streak}</span>
              <span className="font-body text-cream/40 text-xs">day streak</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="mb-4 text-center relative" delay={0.08}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-body text-cream/50 text-xs uppercase tracking-wider">Stretch Goal</span>
            <button
              onClick={() => { setEditingGoal(true); setGoalInput(String(goal)) }}
              className="bg-transparent border-none cursor-pointer p-1"
              aria-label="Edit goal"
            >
              <Pencil size={14} className="text-cream/30" />
            </button>
          </div>
          <ProgressRing current={totalMinutes} goal={goal} />

          {editingGoal && (
            <motion.div
              className="absolute inset-0 glass flex flex-col items-center justify-center gap-3 rounded-[20px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="font-body text-cream text-sm">Set your goal (minutes)</p>
              <input
                type="number"
                inputMode="numeric"
                value={goalInput}
                onChange={e => setGoalInput(e.target.value)}
                className="w-32 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-cream font-mono text-center outline-none focus:border-velvet-light"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleGoalSave}
                  className="px-4 py-2 rounded-xl text-cream font-body text-sm border-none cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #8B2252, #7B3FA0)' }}
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingGoal(false)}
                  className="px-4 py-2 rounded-xl text-cream/50 font-body text-sm bg-white/5 border-none cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </GlassCard>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <motion.button
            onClick={() => navigate('/stretch')}
            className="flex flex-col items-center gap-2 py-4 rounded-2xl font-body text-cream text-xs font-semibold border-none cursor-pointer min-h-[80px]"
            style={{ background: 'linear-gradient(135deg, #8B2252, #7B3FA0)' }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
          >
            <Timer size={24} />
            Start Stretch
          </motion.button>

          <motion.button
            onClick={() => setShowLogModal(true)}
            className="glass flex flex-col items-center gap-2 py-4 rounded-2xl font-body text-cream text-xs font-semibold border-none cursor-pointer min-h-[80px]"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
          >
            <Plus size={24} />
            Log Activity
          </motion.button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <motion.button
            onClick={() => navigate('/journal')}
            className="glass flex flex-col items-center gap-2 py-4 rounded-2xl font-body text-cream/70 text-xs border-none cursor-pointer min-h-[80px]"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
          >
            <BookOpen size={24} />
            Journal
          </motion.button>

          <motion.button
            onClick={() => navigate('/history')}
            className="glass flex flex-col items-center gap-2 py-4 rounded-2xl font-body text-cream/70 text-xs border-none cursor-pointer min-h-[80px]"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.40 }}
          >
            <BarChart3 size={24} />
            History
          </motion.button>
        </div>

        <AnimatePresence>
          {showLogModal && (
            <LogActivityModal
              onClose={() => setShowLogModal(false)}
              onSave={logPastSession}
            />
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}
