import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, X, Trash2, Edit3 } from "lucide-react"
import { supabase } from "../lib/supabase"
import { useAuth } from "../hooks/useAuth"
import GlassCard from "../components/GlassCard"
import MoodSelector, { moods } from "../components/MoodSelector"
import Bloomie from "../components/Bloomie"
import PageTransition from "../components/PageTransition"
import { getRandomMessage, journalPrompts } from "../lib/motivational"

export default function Journal() {
  const { user } = useAuth()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const [editEntry, setEditEntry] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [newMood, setNewMood] = useState("")
  const [newText, setNewText] = useState("")
  const [saving, setSaving] = useState(false)
  const [prompt] = useState(getRandomMessage(journalPrompts))

  const fetchEntries = useCallback(async () => {
    if (!user || !supabase) { setLoading(false); return }
    const { data } = await supabase.from("journal_entries").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
    setEntries(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetchEntries() }, [fetchEntries])

  const handleSave = async () => {
    if (!newText.trim() || !newMood) return
    setSaving(true)
    await supabase.from("journal_entries").insert({ user_id: user.id, mood: newMood, body_text: newText.trim() })
    setShowNew(false); setNewMood(""); setNewText(""); setSaving(false); fetchEntries()
  }

  const handleUpdate = async () => {
    if (!editEntry) return
    setSaving(true)
    await supabase.from("journal_entries").update({ mood: editEntry.mood, body_text: editEntry.body_text, updated_at: new Date().toISOString() }).eq("id", editEntry.id)
    setEditEntry(null); setSaving(false); fetchEntries()
  }

  const handleDelete = async (id) => {
    await supabase.from("journal_entries").delete().eq("id", id)
    setDeleteConfirm(null); setExpandedId(null); fetchEntries()
  }

  const getMoodEmoji = (v) => moods.find(m => m.value === v)?.emoji || ""

  if (loading) {
    return (<PageTransition><div className="px-4 pt-6 pb-24 max-w-[480px] mx-auto"><div className="skeleton h-8 w-48 mb-6" /><div className="skeleton h-32 mb-3" /><div className="skeleton h-32 mb-3" /></div></PageTransition>)
  }

  return (
    <PageTransition>
      <div className="px-4 pt-6 pb-24 max-w-[480px] mx-auto relative">
        <div className="flex items-center gap-2 mb-6">
          <Bloomie state="idle" size={32} />
          <h1 className="font-display text-xl font-bold text-cream">Your Stretch Journal</h1>
        </div>
        {entries.length === 0 && !showNew && (<div className="flex flex-col items-center py-12 text-center"><Bloomie state="sleeping" size={80} /><p className="font-body text-cream/50 text-sm mt-4">No entries yet. Start writing!</p></div>)}
        <AnimatePresence>
          {entries.map((entry, i) => (
            <motion.div key={entry.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="mb-3">
              <GlassCard className="cursor-pointer" delay={0} onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}>
                <div className="flex items-center gap-2"><span className="text-lg">{getMoodEmoji(entry.mood)}</span><span className="text-cream/40 text-xs font-body">{new Date(entry.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span></div>
                <p className={"font-body text-cream/70 text-sm mt-2 " + (expandedId !== entry.id ? "line-clamp-2" : "")}>{entry.body_text}</p>
                {expandedId === entry.id && (<motion.div className="flex gap-2 mt-3 pt-3 border-t border-white/5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><button onClick={(e) => { e.stopPropagation(); setEditEntry({...entry}) }} className="flex items-center gap-1 text-cream/40 text-xs font-body bg-transparent border-none cursor-pointer"><Edit3 size={12} /> Edit</button><button onClick={(e) => { e.stopPropagation(); setDeleteConfirm(entry.id) }} className="flex items-center gap-1 text-velvet-light/50 text-xs font-body bg-transparent border-none cursor-pointer"><Trash2 size={12} /> Delete</button></motion.div>)}
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>

        <motion.button onClick={() => setShowNew(true)} className="fixed bottom-24 right-4 w-14 h-14 rounded-full border-none cursor-pointer flex items-center justify-center z-40 shadow-lg" style={{ background: "linear-gradient(135deg, #8B2252, #7B3FA0)" }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Plus size={24} className="text-cream" />
        </motion.button>
        <AnimatePresence>
          {showNew && (<motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><div className="absolute inset-0 bg-black/60" onClick={() => setShowNew(false)} /><motion.div className="glass p-6 w-full max-w-sm relative z-10" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
            <h2 className="font-display text-lg font-bold text-cream mb-4">New Entry</h2>
            <button onClick={() => setShowNew(false)} className="absolute top-4 right-4 bg-transparent border-none cursor-pointer"><X size={20} className="text-cream/40" /></button>
            <p className="font-body text-cream/50 text-sm mb-3">How is your body feeling?</p>
            <MoodSelector selected={newMood} onSelect={setNewMood} />
            <p className="font-body text-cream/50 text-sm mt-4 mb-2">What is on your mind?</p>
            <textarea value={newText} onChange={e => setNewText(e.target.value)} rows={4} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-cream font-body text-sm outline-none resize-none" placeholder="Write here..." />
            <motion.button onClick={handleSave} disabled={saving || !newText.trim() || !newMood} className="mt-4 w-full py-3 rounded-xl font-body font-semibold text-cream border-none cursor-pointer min-h-[48px] disabled:opacity-30" style={{ background: "linear-gradient(135deg, #8B2252, #7B3FA0)" }} whileTap={{ scale: 0.98 }}>{saving ? "Saving..." : "Save Entry"}</motion.button>
          </motion.div></motion.div>)}
        </AnimatePresence>

        <AnimatePresence>
          {editEntry && (<motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><div className="absolute inset-0 bg-black/60" onClick={() => setEditEntry(null)} /><motion.div className="glass p-6 w-full max-w-sm relative z-10" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
            <h2 className="font-display text-lg font-bold text-cream mb-4">Edit Entry</h2>
            <MoodSelector selected={editEntry.mood} onSelect={m => setEditEntry({...editEntry, mood: m})} />
            <textarea value={editEntry.body_text} onChange={e => setEditEntry({...editEntry, body_text: e.target.value})} rows={4} className="w-full mt-4 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-cream font-body text-sm outline-none resize-none" />
            <div className="flex gap-2 mt-4">
              <motion.button onClick={handleUpdate} disabled={saving} className="flex-1 py-3 rounded-xl font-body font-semibold text-cream border-none cursor-pointer" style={{ background: "linear-gradient(135deg, #8B2252, #7B3FA0)" }} whileTap={{ scale: 0.98 }}>Save</motion.button>
              <button onClick={() => setEditEntry(null)} className="px-4 py-3 rounded-xl text-cream/50 font-body bg-white/5 border-none cursor-pointer">Cancel</button>
            </div>
          </motion.div></motion.div>)}
        </AnimatePresence>

        <AnimatePresence>
          {deleteConfirm && (<motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><div className="absolute inset-0 bg-black/60" onClick={() => setDeleteConfirm(null)} /><motion.div className="glass p-6 w-full max-w-xs relative z-10 text-center" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
            <p className="font-body text-cream text-sm mb-4">Delete this entry?</p>
            <div className="flex gap-2">
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-3 rounded-xl font-body font-semibold text-cream bg-velvet border-none cursor-pointer">Delete</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 rounded-xl text-cream/50 font-body bg-white/5 border-none cursor-pointer">Cancel</button>
            </div>
          </motion.div></motion.div>)}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}