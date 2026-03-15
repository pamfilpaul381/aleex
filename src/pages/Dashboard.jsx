import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Timer, BookOpen, BarChart3, Flame, Pencil } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useStreak } from '../hooks/useStreak'
import { useProfile } from '../hooks/useProfile'
import Bloomie from '../components/Bloomie'
import GlassCard from '../components/GlassCard'
import StreakCalendar from '../components/StreakCalendar'
import ProgressRing from '../components/ProgressRing'
import PageTransition from '../components/PageTransition'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return "Good morning, Alexandra. Let's wake up those muscles."
  if (hour >= 12 && hour < 17) return "Afternoon stretch break? Your body says yes."
  if (hour >= 17 && hour < 21) return "Wind down time. Let's stretch out the day."
  return "Late night stretcher? We love the dedication."
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { streak, totalMinutes, last7Days, loading } = useStreak()
  const { profile, updateProfile } = useProfile()
  const [editingGoal, setEditingGoal] = useState(false)
  const [goalInput, setGoalInput] = useState('')

  const goal = profile?.stretch_goal_minutes || 1000

  const handleGoalSave = async () => {
    const newGoal = parseInt(goalInput) || 1000
    if (newGoal > 0) {
      await updateProfile({ stretch_goal_minutes: newGoal })
    }
    setEditingGoal(false)
  }

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
        {/* Greeting */}
        <div className="flex items-center gap-3 mb-6">
          <Bloomie state={streak > 0 ? 'idle' : 'sleeping'} size={40} />
          <p className="font-body text-cream/80 text-sm text-left">{getGreeting()}</p>
        </div>

        {/* Streak Card */}
        <GlassCard className="mb-4 text-center" delay={0}>
          <div className="flex items-center justify-center gap-2">
            <motion.span
              className="font-mono text-6xl font-bold text-cream"
              key={streak}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              {streak}
            </motion.span>
            {streak >= 3 && <Flame className="text-velvet-light" size={28} />}
          </div>
          <p className="font-body text-cream/50 text-xs uppercase tracking-[3px] mt-1">Day Streak</p>
          {streak === 0 && (
            <p className="text-cream/40 text-xs font-body mt-2">
              Let's start fresh. Day 1 is the hardest, and you're already here.
            </p>
          )}
          <StreakCalendar days={last7Days} />
        </GlassCard>

        {/* Goal Progress */}
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

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3 mb-4">
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
            onClick={() => navigate('/journal')}
            className="glass flex flex-col items-center gap-2 py-4 rounded-2xl font-body text-cream/70 text-xs border-none cursor-pointer min-h-[80px]"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
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
            transition={{ delay: 0.32 }}
          >
            <BarChart3 size={24} />
            History
          </motion.button>
        </div>
      </div>
    </PageTransition>
  )
}
