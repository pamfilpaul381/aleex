import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, BarChart3, TrendingUp, Clock } from "lucide-react"
import { useStreak } from "../hooks/useStreak"
import GlassCard from "../components/GlassCard"
import BarChart from "../components/BarChart"
import HeatmapCalendar from "../components/HeatmapCalendar"
import Bloomie from "../components/Bloomie"
import PageTransition from "../components/PageTransition"

export default function History() {
  const { sessions, streak, totalMinutes, last7Days, loading } = useStreak()
  const [view, setView] = useState("week")

  const totalSessions = sessions.length
  const avgSession = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0

  // Calculate longest streak
  const calcLongestStreak = () => {
    if (sessions.length === 0) return 0
    const dates = [...new Set(sessions.map(s => {
      const d = new Date(s.started_at); d.setHours(0,0,0,0); return d.getTime()
    }))].sort()
    let longest = 1, current = 1
    for (let i = 1; i < dates.length; i++) {
      if (dates[i] - dates[i-1] === 86400000) { current++; longest = Math.max(longest, current) }
      else current = 1
    }
    return longest
  }
  const longestStreak = calcLongestStreak()

  if (loading) {
    return (<PageTransition><div className="px-4 pt-6 pb-24 max-w-[480px] mx-auto"><div className="skeleton h-8 w-48 mb-6" /><div className="skeleton h-48 mb-4" /><div className="skeleton h-32" /></div></PageTransition>)
  }

  return (
    <PageTransition>
      <div className="px-4 pt-6 pb-24 max-w-[480px] mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Bloomie state="idle" size={32} />
          <h1 className="font-display text-xl font-bold text-cream">Your Progress</h1>
        </div>

        <div className="flex gap-2 mb-4">
          <motion.button onClick={() => setView("week")} whileTap={{ scale: 0.95 }} className={"flex-1 py-2 rounded-xl font-body text-sm border-none cursor-pointer min-h-[44px] " + (view === "week" ? "bg-velvet-light text-cream" : "bg-white/5 text-cream/60")}><BarChart3 size={14} className="inline mr-1" />Week</motion.button>
          <motion.button onClick={() => setView("month")} whileTap={{ scale: 0.95 }} className={"flex-1 py-2 rounded-xl font-body text-sm border-none cursor-pointer min-h-[44px] " + (view === "month" ? "bg-velvet-light text-cream" : "bg-white/5 text-cream/60")}><Calendar size={14} className="inline mr-1" />Month</motion.button>
        </div>

        <GlassCard className="mb-4">
          {view === "week" ? <BarChart data={last7Days} /> : <HeatmapCalendar sessions={sessions} />}
        </GlassCard>

        <h2 className="font-display text-lg font-semibold text-cream mb-3">All-Time Stats</h2>
        <div className="grid grid-cols-2 gap-3">
          <GlassCard className="text-center" delay={0.05}><Clock size={20} className="text-velvet-light mx-auto mb-1" /><span className="font-mono text-xl text-cream">{totalMinutes}</span><p className="text-cream/40 text-[10px] font-body">Total Minutes</p></GlassCard>
          <GlassCard className="text-center" delay={0.1}><TrendingUp size={20} className="text-velvet-light mx-auto mb-1" /><span className="font-mono text-xl text-cream">{totalSessions}</span><p className="text-cream/40 text-[10px] font-body">Total Sessions</p></GlassCard>
          <GlassCard className="text-center" delay={0.15}><span className="text-velvet-light text-lg">&#x1F525;</span><span className="font-mono text-xl text-cream block">{longestStreak}</span><p className="text-cream/40 text-[10px] font-body">Longest Streak</p></GlassCard>
          <GlassCard className="text-center" delay={0.2}><span className="text-velvet-light text-lg">&#x23F1;</span><span className="font-mono text-xl text-cream block">{avgSession}</span><p className="text-cream/40 text-[10px] font-body">Avg Session (min)</p></GlassCard>
        </div>

        {sessions.length === 0 && (<div className="flex flex-col items-center py-8 text-center mt-4"><Bloomie state="sleeping" size={60} /><p className="font-body text-cream/40 text-sm mt-3">Complete your first stretch to see stats here!</p></div>)}
      </div>
    </PageTransition>
  )
}