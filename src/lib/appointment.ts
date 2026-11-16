import { site } from '../config/site'

export type AppointmentValues = {
  name: string
  phone: string
  email: string
  date: string
  type: string
  message: string
}

export type AppointmentErrors = Partial<Record<keyof AppointmentValues, string>>

export const emptyAppointment: AppointmentValues = { name: '', phone: '', email: '', date: '', type: '', message: '' }

/** Today in the visitor's own timezone, as YYYY-MM-DD (the <input type="date"> format). */
export function todayISO() {
  const now = new Date()
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10)
}

export function validateAppointment(v: AppointmentValues): AppointmentErrors {
  const e: AppointmentErrors = {}

  if (v.name.trim().length < 2) e.name = 'Please enter your full name.'

  const phoneDigits = v.phone.replace(/\D/g, '')
  if (!v.phone.trim()) e.phone = 'Please enter a phone number.'
  else if (!/^\+?[\d\s().-]+$/.test(v.phone.trim()) || phoneDigits.length < 7 || phoneDigits.length > 15)
    e.phone = 'Please enter a valid phone number, including the area or country code.'

  if (!v.email.trim()) e.email = 'Please enter your email address.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Please enter a valid email address.'

  if (!v.date) e.date = 'Please choose a preferred date.'
  else if (Number.isNaN(Date.parse(v.date))) e.date = 'Please enter a valid date.'
  else if (v.date < todayISO()) e.date = 'Please choose today or a future date.'

  if (!v.type) e.type = 'Please select a type of suit.'

  if (v.message.length > 1000) e.message = 'Please keep your message under 1,000 characters.'

  return e
}

export function formatDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** Plain-text request used for the WhatsApp and email hand-off. */
export function appointmentMessage(v: AppointmentValues) {
  return [
    `Appointment request — ${site.name}`,
    '',
    `Name: ${v.name.trim()}`,
    `Phone: ${v.phone.trim()}`,
    `Email: ${v.email.trim()}`,
    `Preferred date: ${formatDate(v.date)}`,
    `Type of suit: ${v.type}`,
    v.message.trim() && `Message: ${v.message.trim()}`,
  ]
    .filter((line): line is string => typeof line === 'string')
    .join('\n')
}
