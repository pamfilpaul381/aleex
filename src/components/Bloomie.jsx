import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const states = {
  idle: {
    stem: { scaleY: 1, rotate: 0 },
    petals: { scale: 1, translateX: 0 },
    leaves: { scale: 1 },
    face: 'happy',
  },
  stretching: {
    stem: { scaleY: 1.3, rotate: 0 },
    petals: { scale: 1.1, translateX: 5 },
    leaves: { scale: 1.2 },
    face: 'happy',
  },
  celebration: {
    stem: { scaleY: 1, rotate: 0 },
    petals: { scale: 1.15, translateX: 3 },
    leaves: { scale: 1.1 },
    face: 'excited',
  },
  sleeping: {
    stem: { scaleY: 0.95, rotate: -10 },
    petals: { scale: 0.9, translateX: -2 },
    leaves: { scale: 0.9 },
    face: 'sleepy',
  },
}

function Confetti({ show }) {
  if (!show) return null
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 80,
    y: -(Math.random() * 60 + 20),
    size: Math.random() * 6 + 3,
    color: ['#FFD700', '#C2185B', '#D4B5E6', '#4CAF50', '#7B3FA0'][i % 5],
    delay: Math.random() * 0.3,
  }))

  return (
    <>
      {particles.map(p => (
        <motion.circle
          key={p.id}
          cx={60}
          cy={30}
          r={p.size}
          fill={p.color}
          initial={{ opacity: 1, x: 0, y: 0 }}
          animate={{ opacity: 0, x: p.x, y: p.y }}
          transition={{ duration: 1, delay: p.delay, ease: 'easeOut' }}
        />
      ))}
    </>
  )
}

export default function Bloomie({ state = 'idle', size = 120, className = '' }) {
  const [showConfetti, setShowConfetti] = useState(false)
  const config = states[state] || states.idle
  const scale = size / 120

  useEffect(() => {
    if (state === 'celebration') {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 1500)
      return () => clearTimeout(timer)
    }
  }, [state])

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      animate={state === 'idle' ? { rotate: [-3, 3, -3] } : {}}
      transition={state === 'idle' ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : {}}
      style={{ transformOrigin: 'bottom center' }}
    >
      <defs>
        <linearGradient id="petalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B2252" />
          <stop offset="100%" stopColor="#7B3FA0" />
        </linearGradient>
        <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2E7D32" />
          <stop offset="100%" stopColor="#4CAF50" />
        </linearGradient>
      </defs>

      {/* Stem */}
      <motion.path
        d="M60 55 Q58 75 60 105"
        stroke="url(#leafGrad)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        animate={{ scaleY: config.stem.scaleY }}
        transition={{ type: 'spring', stiffness: 100, damping: 10 }}
        style={{ transformOrigin: 'bottom center' }}
      />

      {/* Left leaf */}
      <motion.path
        d="M58 80 Q42 72 38 82 Q44 88 58 84"
        fill="url(#leafGrad)"
        animate={{ scale: config.leaves.scale }}
        transition={{ type: 'spring', stiffness: 100, damping: 10 }}
        style={{ transformOrigin: '58px 82px' }}
      />

      {/* Right leaf */}
      <motion.path
        d="M62 75 Q78 67 82 77 Q76 83 62 79"
        fill="url(#leafGrad)"
        animate={{ scale: config.leaves.scale }}
        transition={{ type: 'spring', stiffness: 100, damping: 10 }}
        style={{ transformOrigin: '62px 77px' }}
      />

      {/* Flower head group */}
      <motion.g
        animate={state === 'celebration' ? { y: [0, -8, 0] } : {}}
        transition={state === 'celebration' ? { duration: 0.5, repeat: 3, ease: 'easeInOut' } : {}}
      >
        {/* Left petal */}
        <motion.ellipse
          cx="46"
          cy="38"
          rx="14"
          ry="20"
          fill="url(#petalGrad)"
          transform="rotate(-20 46 38)"
          animate={{ x: -(config.petals.translateX), scale: config.petals.scale }}
          transition={{ type: 'spring', stiffness: 100, damping: 10 }}
        />

        {/* Center petal */}
        <motion.ellipse
          cx="60"
          cy="32"
          rx="14"
          ry="22"
          fill="url(#petalGrad)"
          animate={{ scale: config.petals.scale }}
          transition={{ type: 'spring', stiffness: 100, damping: 10 }}
        />

        {/* Right petal */}
        <motion.ellipse
          cx="74"
          cy="38"
          rx="14"
          ry="20"
          fill="url(#petalGrad)"
          transform="rotate(20 74 38)"
          animate={{ x: config.petals.translateX, scale: config.petals.scale }}
          transition={{ type: 'spring', stiffness: 100, damping: 10 }}
        />

        {/* Face */}
        {config.face === 'sleepy' ? (
          <>
            <line x1="51" y1="42" x2="55" y2="42" stroke="#FFF5F7" strokeWidth="2" strokeLinecap="round" />
            <line x1="65" y1="42" x2="69" y2="42" stroke="#FFF5F7" strokeWidth="2" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="53" cy="42" r="2.5" fill="#FFF5F7" />
            <circle cx="67" cy="42" r="2.5" fill="#FFF5F7" />
          </>
        )}

        {config.face === 'excited' ? (
          <ellipse cx="60" cy="50" rx="4" ry="3" fill="#FFF5F7" />
        ) : config.face === 'sleepy' ? (
          <path d="M57 49 Q60 50 63 49" stroke="#FFF5F7" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M56 49 Q60 53 64 49" stroke="#FFF5F7" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        )}

        {/* Celebration glow */}
        {state === 'celebration' && (
          <motion.ellipse
            cx="60"
            cy="38"
            rx="30"
            ry="28"
            fill="none"
            stroke="#FFD700"
            strokeWidth="2"
            initial={{ opacity: 0.6, scale: 1 }}
            animate={{ opacity: 0, scale: 1.4 }}
            transition={{ duration: 1, repeat: 2 }}
          />
        )}
      </motion.g>

      <Confetti show={showConfetti} />
    </motion.svg>
  )
}
