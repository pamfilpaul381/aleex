import { useState, useEffect, useRef, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Pause, Square, Play } from "lucide-react"
import Bloomie from "../components/Bloomie"
import TimerRing from "../components/Timer"
import MoodSelector from "../components/MoodSelector"
import GlassCard from "../components/GlassCard"
import PageTransition from "../components/PageTransition"
import { useStreak } from "../hooks/useStreak"
import { getRandomMessage, preStretchMessages, duringStretchMessages } from "../lib/motivational"

const durations = [5, 10, 15, 20]

export default function Stretch() {
  const navigate = useNavigate()
  const { saveSession, todayMinutes, streak } = useStreak()
  const [phase, setPhase] = useState("pre")
  const [selectedMinutes, setSelectedMinutes] = useState(10)
  const [customInput, setCustomInput] = useState("")
  const [showCustom, setShowCustom] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [mood, setMood] = useState("")
  const [note, setNote] = useState("")
  const [saving, setSaving] = useState(false)
  const [motivMessage] = useState(getRandomMessage(preStretchMessages))
  const [timerMessage, setTimerMessage] = useState(getRandomMessage(duringStretchMessages))
  const intervalRef = useRef(null)
  const messageIntervalRef = useRef(null)

  const startTimer = useCallback(() => {
    const totalSeconds = selectedMinutes * 60
    setTotalTime(totalSeconds)
    setTimeRemaining(totalSeconds)
    setPhase("active")
  }, [selectedMinutes])

  useEffect(() => {
    if (phase === "active") {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) { clearInterval(intervalRef.current); setPhase("post"); return 0 }
          return prev - 1
        })
      }, 1000)
      messageIntervalRef.current = setInterval(() => setTimerMessage(getRandomMessage(duringStretchMessages)), 60000)
      return () => { clearInterval(intervalRef.current); clearInterval(messageIntervalRef.current) }
    }
  }, [phase])

  const handlePause = () => { clearInterval(intervalRef.current); setPhase("paused") }
  const handleResume = () => setPhase("active")
  const handleStop = () => {
    clearInterval(intervalRef.current); clearInterval(messageIntervalRef.current)
    const elapsed = totalTime - timeRemaining
    const elapsedMinutes = Math.round(elapsed / 60)
    if (elapsedMinutes > 0) { setSelectedMinutes(elapsedMinutes); setPhase("post") } else setPhase("pre")
  }
  const handleSave = async () => {
    setSaving(true)
    try { await saveSession({ durationMinutes: selectedMinutes, mood: mood || null, note: note || null }) } catch {}
    setSaving(false); navigate("/dashboard")
  }
  return (
    <PageTransition>
      <div className="min-h-[100dvh] flex flex-col items-center justify-center px-4 pb-24">
        <AnimatePresence mode="wait">
          {phase === "pre" && (
            <motion.div key="pre" className="flex flex-col items-center text-center w-full max-w-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Bloomie state="idle" size={100} />
              <p className="font-body text-cream/60 text-sm mt-4 mb-6 italic">{motivMessage}</p>
              <div className="flex gap-2 mb-4 flex-wrap justify-center">
                {durations.map(d => (
                  <motion.button key={d} onClick={() => { setSelectedMinutes(d); setShowCustom(false) }} whileTap={{ scale: 0.95 }}
                    className={"px-4 py-2 rounded-xl font-body text-sm border-none cursor-pointer min-h-[44px] " + (selectedMinutes === d && !showCustom ? "bg-velvet-light text-cream" : "bg-white/5 text-cream/60")}>
                    {d} min
                  </motion.button>
                ))}
                <motion.button onClick={() => setShowCustom(true)} whileTap={{ scale: 0.95 }}
                  className={"px-4 py-2 rounded-xl font-body text-sm border-none cursor-pointer min-h-[44px] " + (showCustom ? "bg-velvet-light text-cream" : "bg-white/5 text-cream/60")}>
                  Custom
                </motion.button>
              </div>
              {showCustom && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-4">
                  <input type="number" inputMode="numeric" placeholder="Minutes" value={customInput}
                    onChange={e => { setCustomInput(e.target.value); const v = parseInt(e.target.value); if (v > 0) setSelectedMinutes(v) }}
                    className="w-24 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-cream font-mono text-center outline-none focus:border-velvet-light" autoFocus />
                </motion.div>
              )}
              <motion.button onClick={startTimer}
                className="px-10 py-4 rounded-2xl font-body font-bold text-cream text-lg border-none cursor-pointer min-h-[56px]"
                style={{ background: "linear-gradient(135deg, #8B2252, #7B3FA0)" }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                animate={{ boxShadow: ["0 0 20px rgba(139,34,82,0.3)", "0 0 40px rgba(139,34,82,0.6)", "0 0 20px rgba(139,34,82,0.3)"] }}
                transition={{ boxShadow: { duration: 2, repeat: Infinity } }}>
                Begin
              </motion.button>
            </motion.div>
          )}
          {(phase === "active" || phase === "paused") && (
            <motion.div key="active" className="flex flex-col items-center text-center w-full max-w-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Bloomie state="stretching" size={80} className="mb-4" />
              <TimerRing timeRemaining={timeRemaining} totalTime={totalTime} />
              {phase === "paused" && <p className="font-body text-cream/50 text-sm mt-4 italic">Take your time. We will wait.</p>}
              <p className="font-body text-cream/40 text-xs mt-4 max-w-[250px] italic">{timerMessage}</p>
              <div className="flex gap-4 mt-6">
                {phase === "active" ? (
                  <motion.button onClick={handlePause} whileTap={{ scale: 0.9 }} className="glass p-4 rounded-full border-none cursor-pointer min-h-[56px] min-w-[56px] flex items-center justify-center">
                    <Pause size={24} className="text-cream" />
                  </motion.button>
                ) : (
                  <motion.button onClick={handleResume} whileTap={{ scale: 0.9 }} className="p-4 rounded-full border-none cursor-pointer min-h-[56px] min-w-[56px] flex items-center justify-center" style={{ background: "linear-gradient(135deg, #8B2252, #7B3FA0)" }}>
                    <Play size={24} className="text-cream" />
                  </motion.button>
                )}
                <motion.button onClick={handleStop} whileTap={{ scale: 0.9 }} className="glass p-4 rounded-full border-none cursor-pointer min-h-[56px] min-w-[56px] flex items-center justify-center">
                  <Square size={20} className="text-cream" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {phase === "post" && (
            <motion.div key="post" className="flex flex-col items-center text-center w-full max-w-sm" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <Bloomie state="celebration" size={100} />
              <motion.h2 className="font-display text-2xl font-bold text-cream mt-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>Amazing!</motion.h2>
              <p className="font-body text-cream/60 text-sm mt-1">You just stretched for {selectedMinutes} minutes!</p>
              <div className="flex gap-6 mt-4 text-center">
                <div><span className="font-mono text-lg text-cream">{selectedMinutes}</span><p className="text-cream/40 text-[10px] font-body">This session</p></div>
                <div><span className="font-mono text-lg text-cream">{todayMinutes + selectedMinutes}</span><p className="text-cream/40 text-[10px] font-body">Today total</p></div>
                <div><span className="font-mono text-lg text-cream">{streak}</span><p className="text-cream/40 text-[10px] font-body">Day streak</p></div>
              </div>
              <GlassCard className="w-full mt-6">
                <p className="font-body text-cream/70 text-sm mb-3">How are you feeling?</p>
                <MoodSelector selected={mood} onSelect={setMood} />
              </GlassCard>
              <div className="w-full mt-4">
                <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note (optional)" rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-cream font-body text-sm outline-none focus:border-velvet-light resize-none" />
              </div>
              <motion.button onClick={handleSave} disabled={saving}
                className="mt-4 w-full py-3 rounded-xl font-body font-semibold text-cream border-none cursor-pointer min-h-[48px] disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #8B2252, #7B3FA0)" }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                {saving ? "Saving..." : "Save & Return"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}