import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

export function useStreak() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState([])
  const [streak, setStreak] = useState(0)
  const [totalMinutes, setTotalMinutes] = useState(0)
  const [loading, setLoading] = useState(true)
  const [last7Days, setLast7Days] = useState([])

  const fetchSessions = useCallback(async () => {
    if (!user || !supabase) {
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('stretch_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('started_at', { ascending: false })

    if (error) {
      setLoading(false)
      return
    }

    setSessions(data || [])
    calculateStats(data || [])
    setLoading(false)
  }, [user])

  const calculateStats = (sessions) => {
    const total = sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0)
    setTotalMinutes(total)

    // Calculate streak
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const sessionDates = new Set(
      sessions.map(s => {
        const d = new Date(s.started_at)
        d.setHours(0, 0, 0, 0)
        return d.getTime()
      })
    )

    let currentStreak = 0
    const checkDate = new Date(today)
    
    if (!sessionDates.has(checkDate.getTime())) {
      checkDate.setDate(checkDate.getDate() - 1)
    }

    while (sessionDates.has(checkDate.getTime())) {
      currentStreak++
      checkDate.setDate(checkDate.getDate() - 1)
    }

    setStreak(currentStreak)

    // Last 7 days
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      d.setHours(0, 0, 0, 0)
      const dayMinutes = sessions
        .filter(s => {
          const sd = new Date(s.started_at)
          sd.setHours(0, 0, 0, 0)
          return sd.getTime() === d.getTime()
        })
        .reduce((sum, s) => sum + (s.duration_minutes || 0), 0)
      days.push({
        date: d,
        minutes: dayMinutes,
        done: dayMinutes > 0,
        isToday: i === 0,
      })
    }
    setLast7Days(days)
  }

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  const saveSession = async ({ durationMinutes, mood, note, bodyArea, intensity }) => {
    if (!user || !supabase) return
    const { data, error } = await supabase
      .from('stretch_sessions')
      .insert({
        user_id: user.id,
        started_at: new Date().toISOString(),
        duration_minutes: durationMinutes,
        mood,
        note,
        body_area: bodyArea || null,
        intensity: intensity || null,
      })
      .select()
      .single()
    if (error) throw error
    await fetchSessions()
    return data
  }

  const logPastSession = async ({ durationMinutes, bodyArea, intensity, date }) => {
    if (!user || !supabase) return
    const sessionDate = date ? new Date(date) : new Date()
    sessionDate.setHours(12, 0, 0, 0)
    const { data, error } = await supabase
      .from('stretch_sessions')
      .insert({
        user_id: user.id,
        started_at: sessionDate.toISOString(),
        duration_minutes: durationMinutes,
        body_area: bodyArea,
        intensity: intensity,
      })
      .select()
      .single()
    if (error) throw error
    await fetchSessions()
    return data
  }

  const todayMinutes = last7Days.find(d => d.isToday)?.minutes || 0
  const stretchedToday = todayMinutes > 0

  return { sessions, streak, totalMinutes, todayMinutes, stretchedToday, last7Days, loading, saveSession, logPastSession, refetch: fetchSessions }
}
