export const preStretchMessages = [
  "Your body has been waiting for this moment.",
  "Flexibility is freedom. Let's get free.",
  "Even 5 minutes can change your whole day.",
  "You showed up. That's already a win.",
  "Stretch like nobody's watching. Because they're not.",
  "Your future self is already thanking you.",
  "Tight muscles? Not for long.",
  "This is your time. Own it.",
  "One stretch closer to your goal.",
  "Alexandra, let's make today count.",
]

export const duringStretchMessages = [
  "You're doing incredible. Keep breathing.",
  "Feel that? That's progress.",
  "Every second here is a gift to your body.",
  "Inhale possibility. Exhale tension.",
  "You're stronger than you think.",
  "Almost there. Finish strong.",
  "Your body is saying 'thank you' right now.",
  "Stay with it. You've got this.",
]

export const journalPrompts = [
  "What part of your body needed the most attention today?",
  "Did you notice any progress since last week?",
  "What would you tell someone who's thinking about starting to stretch?",
  "How did stretching affect your mood today?",
]

export const getRandomMessage = (messages) =>
  messages[Math.floor(Math.random() * messages.length)]
