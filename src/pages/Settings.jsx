import { useState } from "react"
import { motion } from "framer-motion"
import { LogOut, Download, Bell, User, Target } from "lucide-react"
import { useAuth } from "../hooks/useAuth"
import { useProfile } from "../hooks/useProfile"
import { useStreak } from "../hooks/useStreak"
import { isEmailJSConfigured, sendReminder } from "../lib/emailjs"
import { getRandomMessage, preStretchMessages } from "../lib/motivational"
import GlassCard from "../components/GlassCard"
import Bloomie from "../components/Bloomie"
import PageTransition from "../components/PageTransition"

export default function Settings() {
  const { user, signOut } = useAuth()
  const { profile, updateProfile } = useProfile()
  const { sessions, totalMinutes } = useStreak()
  const [goalInput, setGoalInput] = useState("")
  const [editingGoal, setEditingGoal] = useState(false)
  const [reminderEnabled, setReminderEnabled] = useState(false)
  const [reminderTime, setReminderTime] = useState("08:00")
  const [signingOut, setSigningOut] = useState(false)

  const handleGoalSave = async () => {
    const val = parseInt(goalInput) || 1000
    if (val > 0) await updateProfile({ stretch_goal_minutes: val })
    setEditingGoal(false)
  }

  const handleSignOut = async () => {
    setSigningOut(true)
    try { await signOut() } catch {}
    setSigningOut(false)
  }

  const handleExport = () => {
    const data = { sessions, profile, exportedAt: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = "locked-in-alex-data.json"; a.click()
    URL.revokeObjectURL(url)
  }

  const handleTestReminder = async () => {
    if (!isEmailJSConfigured()) return
    await sendReminder({ toName: profile?.display_name || "Alex", toEmail: user?.email, streakCount: 0, motivationalMessage: getRandomMessage(preStretchMessages), totalMinutes, goalMinutes: profile?.stretch_goal_minutes || 1000 })
  }

  return (
    <PageTransition>
      <div className="px-4 pt-6 pb-24 max-w-[480px] mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Bloomie state="idle" size={32} />
          <h1 className="font-display text-xl font-bold text-cream">Settings</h1>
        </div>

        <GlassCard className="mb-4" delay={0}>
          <div className="flex items-center gap-3 mb-3"><User size={18} className="text-velvet-light" /><span className="font-body text-cream/70 text-sm">Profile</span></div>
          <p className="font-body text-cream text-sm">{profile?.display_name || "User"}</p>
          <p className="font-body text-cream/40 text-xs">{user?.email}</p>
        </GlassCard>

        <GlassCard className="mb-4" delay={0.05}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3"><Target size={18} className="text-velvet-light" /><span className="font-body text-cream/70 text-sm">Stretch Goal</span></div>
            {!editingGoal && <button onClick={() => { setEditingGoal(true); setGoalInput(String(profile?.stretch_goal_minutes || 1000)) }} className="text-cream/30 text-xs font-body bg-transparent border-none cursor-pointer">Edit</button>}
          </div>
          {editingGoal ? (
            <div className="flex gap-2">
              <input type="number" inputMode="numeric" value={goalInput} onChange={e => setGoalInput(e.target.value)} className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-cream font-mono text-sm outline-none focus:border-velvet-light" autoFocus />
              <motion.button onClick={handleGoalSave} className="px-4 py-2 rounded-xl font-body text-sm text-cream border-none cursor-pointer" style={{ background: "linear-gradient(135deg, #8B2252, #7B3FA0)" }} whileTap={{ scale: 0.95 }}>Save</motion.button>
              <button onClick={() => setEditingGoal(false)} className="px-3 py-2 rounded-xl text-cream/50 font-body text-sm bg-white/5 border-none cursor-pointer">X</button>
            </div>
          ) : (<p className="font-mono text-cream text-lg">{profile?.stretch_goal_minutes || 1000} <span className="text-cream/40 text-xs font-body">minutes</span></p>)}
        </GlassCard>

        {isEmailJSConfigured() && (
          <GlassCard className="mb-4" delay={0.1}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3"><Bell size={18} className="text-velvet-light" /><span className="font-body text-cream/70 text-sm">Email Reminders</span></div>
              <button onClick={() => setReminderEnabled(!reminderEnabled)} className={"w-12 h-6 rounded-full relative transition-colors border-none cursor-pointer " + (reminderEnabled ? "bg-velvet-light" : "bg-white/10")}><motion.div className="absolute top-0.5 w-5 h-5 rounded-full bg-cream" animate={{ left: reminderEnabled ? 26 : 2 }} /></button>
            </div>
            {reminderEnabled && (<div className="mt-3"><input type="time" value={reminderTime} onChange={e => setReminderTime(e.target.value)} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-cream font-body text-sm outline-none" /><button onClick={handleTestReminder} className="ml-2 text-cream/40 text-xs font-body bg-transparent border-none cursor-pointer">Send test</button></div>)}
          </GlassCard>
        )}

        <GlassCard className="mb-4" delay={0.15}>
          <motion.button onClick={handleExport} whileTap={{ scale: 0.95 }} className="w-full flex items-center gap-3 bg-transparent border-none cursor-pointer min-h-[44px]">
            <Download size={18} className="text-velvet-light" /><span className="font-body text-cream/70 text-sm">Export Your Data</span>
          </motion.button>
        </GlassCard>

        <motion.button onClick={handleSignOut} disabled={signingOut} whileTap={{ scale: 0.95 }} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border-none cursor-pointer min-h-[48px] disabled:opacity-50">
          <LogOut size={18} className="text-velvet-light" /><span className="font-body text-cream/60 text-sm">{signingOut ? "Signing out..." : "Sign Out"}</span>
        </motion.button>
      </div>
    </PageTransition>
  )
}