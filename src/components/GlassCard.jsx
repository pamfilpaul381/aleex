import { motion } from 'framer-motion'

export default function GlassCard({ children, className = '', delay = 0, ...props }) {
  return (
    <motion.div
      className={`glass p-5 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
