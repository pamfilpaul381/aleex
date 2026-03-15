import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Bloomie from '../components/Bloomie'
import PageTransition from '../components/PageTransition'

export default function Welcome() {
  const navigate = useNavigate()

  return (
    <PageTransition>
      <div className="min-h-[100dvh] flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
        >
          <Bloomie state="idle" size={140} />
        </motion.div>

        <motion.h1
          className="font-display text-3xl md:text-4xl font-bold text-cream mt-8 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Hey there, beautiful.
          <br />
          Ready to get locked in?
        </motion.h1>

        <motion.p
          className="font-body text-cream/60 mt-4 max-w-xs text-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Locked In Alex helps you build a stretching habit, one gentle minute at a time.
        </motion.p>

        <motion.button
          className="mt-8 px-8 py-4 rounded-2xl font-body font-semibold text-cream text-lg border-none cursor-pointer relative overflow-hidden min-h-[52px]"
          style={{
            background: 'linear-gradient(135deg, #8B2252, #7B3FA0)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/auth')}
        >
          Let's Get Locked In
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />
        </motion.button>
      </div>
    </PageTransition>
  )
}
