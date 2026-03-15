import emailjs from '@emailjs/browser'

const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || ''
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || ''
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''

export const isEmailJSConfigured = () => !!(serviceId && templateId && publicKey)

export const sendReminder = async ({ toName, toEmail, streakCount, motivationalMessage, totalMinutes, goalMinutes }) => {
  if (!isEmailJSConfigured()) return

  return emailjs.send(serviceId, templateId, {
    to_name: toName,
    to_email: toEmail,
    streak_count: streakCount,
    motivational_message: motivationalMessage,
    total_minutes: totalMinutes,
    goal_minutes: goalMinutes,
  }, publicKey)
}
