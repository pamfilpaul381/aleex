import { motion } from 'framer-motion'

const moods = [
  { value: 'energized', emoji: '\u26A1', label: 'Energized' },
  { value: 'relaxed', emoji: '\uD83D\uDE0C', label: 'Relaxed' },
  { value: 'sore', emoji: '\uD83D\uDCAA', label: 'Sore (but good!)' },
  { value: 'meh', emoji: '\uD83D\uDE10', label: 'Meh' },
  { value: 'tired', emoji: '\uD83D\uDE34', label: 'Tired' },
]

export default function MoodSelector({ selected, onSelect }) {
  return (
    <div className="flex justify-center gap-3 flex-wrap">
      {moods.map(({ value, emoji, label }) => (
        <motion.button
          key={value}
          onClick={() => onSelect(value)}
          whileTap={{ scale: 0.9 }}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl min-w-[56px] min-h-[56px] border-none cursor-pointer transition-colors ${
            selected === value
              ? 'bg-velvet-light/30 ring-2 ring-velvet-light'
              : 'bg-white/5 hover:bg-white/10'
          }`}
        >
          <span className="text-2xl">{emoji}</span>
          <span className="text-[10px] text-cream/70 font-body">{label}</span>
        </motion.button>
      ))}
    </div>
  )
}

export { moods }
