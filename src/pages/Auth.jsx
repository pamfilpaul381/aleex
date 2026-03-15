import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import Bloomie from '../components/Bloomie'
import GlassCard from '../components/GlassCard'
import PageTransition from '../components/PageTransition'

export default function Auth() {
  const { signIn, signUp, signInWithMagicLink } = useAuth()
  const navigate = useNavigate()
  const [isSignUp, setIsSignUp] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isSignUp) {
        await signUp(email, password)
      } else {
        await signIn(email, password)
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || "Oops! Something went sideways. Try again?")
    }
    setLoading(false)
  }

  const handleMagicLink = async () => {
    setError('')
    setLoading(true)
    try {
      await signInWithMagicLink(email)
      setMagicLinkSent(true)
    } catch (err) {
      setError(err.message || "Oops! That didn't work. Try again?")
    }
    setLoading(false)
  }

  return (
    <PageTransition>
      <div className="min-h-[100dvh] flex flex-col items-center justify-center px-4">
        <div className="absolute top-6 right-6">
          <Bloomie state="idle" size={50} />
        </div>

        <GlassCard className="w-full max-w-sm">
          <h2 className="font-display text-2xl font-bold text-cream text-center mb-6">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>

          {magicLinkSent ? (
            <div className="text-center">
              <p className="text-cream/70 font-body">Check your email for the magic link!</p>
              <button
                onClick={() => setMagicLinkSent(false)}
                className="mt-4 text-velvet-light font-body text-sm bg-transparent border-none cursor-pointer"
              >
                Go back
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-cream font-body outline-none focus:border-velvet-light transition-colors"
              />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-cream font-body outline-none focus:border-velvet-light transition-colors"
              />

              {error && (
                <motion.p
                  className="text-velvet-light text-sm font-body text-center"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: [0, -5, 5, -5, 0] }}
                  transition={{ duration: 0.4 }}
                >
                  {error}
                </motion.p>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-body font-semibold text-cream border-none cursor-pointer min-h-[48px] disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #8B2252, #7B3FA0)' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? '...' : isSignUp ? 'Sign Up' : 'Sign In'}
              </motion.button>

              <button
                type="button"
                onClick={handleMagicLink}
                disabled={!email || loading}
                className="text-cream/50 text-sm font-body bg-transparent border-none cursor-pointer hover:text-cream/80 disabled:opacity-30"
              >
                Send magic link instead
              </button>

              <button
                type="button"
                onClick={() => { setIsSignUp(!isSignUp); setError('') }}
                className="text-cream/50 text-sm font-body bg-transparent border-none cursor-pointer hover:text-cream/80"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </form>
          )}
        </GlassCard>
      </div>
    </PageTransition>
  )
}
