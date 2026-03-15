import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Timer, BookOpen, Settings } from 'lucide-react'
import { motion } from 'framer-motion'

const tabs = [
  { path: '/dashboard', icon: Home, label: 'Home' },
  { path: '/stretch', icon: Timer, label: 'Stretch' },
  { path: '/journal', icon: BookOpen, label: 'Journal' },
  { path: '/settings', icon: Settings, label: 'Settings' },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass safe-bottom" style={{ borderRadius: '20px 20px 0 0' }}>
      <div className="flex justify-around items-center h-16 max-w-[480px] mx-auto">
        {tabs.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path
          return (
            <motion.button
              key={path}
              onClick={() => navigate(path)}
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center justify-center gap-1 min-w-[60px] min-h-[44px] bg-transparent border-none cursor-pointer"
              aria-label={label}
            >
              <Icon
                size={22}
                className={isActive ? 'text-velvet-light' : 'text-cream/50'}
              />
              <span
                className={`text-[10px] font-body font-semibold ${
                  isActive ? 'text-velvet-light' : 'text-cream/50'
                }`}
              >
                {label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </nav>
  )
}
