import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowRight, ChevronDown, Mail, MessageCircle } from 'lucide-react'
import { mailtoUrl, site, whatsappUrl } from '../config/site'
import { suitTypes } from '../data/content'
import {
  appointmentMessage,
  emptyAppointment,
  formatDate,
  todayISO,
  validateAppointment,
  type AppointmentErrors,
  type AppointmentValues,
} from '../lib/appointment'
import { goldButton } from '../components/ui/Button'
import { ParallaxImage } from '../components/ui/ParallaxImage'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { cn } from '../lib/cn'

/**
 * `idle`   – filling in the form
 * `sending`– posting to VITE_APPOINTMENT_ENDPOINT (only when one is configured)
 * `sent`   – the endpoint accepted the request (a request, not a confirmed booking)
 * `ready`  – no backend: the request is prepared for the visitor to send themselves
 * `error`  – the endpoint failed; the visitor can still send it themselves
 */
type Status = 'idle' | 'sending' | 'sent' | 'ready' | 'error'

const ENDPOINT = import.meta.env.VITE_APPOINTMENT_ENDPOINT as string | undefined
const fieldOrder: Array<keyof AppointmentValues> = ['name', 'phone', 'email', 'date', 'type', 'message']
const control =
  'peer w-full border-b border-ivory/20 bg-transparent py-3 text-lg font-light text-ivory outline-none transition-colors duration-500 placeholder:text-ivory/25 hover:border-ivory/40 focus:border-gold aria-[invalid=true]:border-[#d98e7a]'

type FieldProps = {
  label: string
  error?: string
  optional?: boolean
  className?: string
  children: (props: { id: string; 'aria-invalid': boolean; 'aria-describedby'?: string }) => ReactNode
}

function Field({ label, error, optional, className, children }: FieldProps) {
  const id = useId()
  const errorId = `${id}-error`
  return (
    <div className={className}>
      <label htmlFor={id} className="eyebrow flex justify-between text-ivory/55">
        {label}
        {optional && <span className="tracking-[0.2em] text-ivory/30">Optional</span>}
      </label>
      {children({ id, 'aria-invalid': !!error, 'aria-describedby': error ? errorId : undefined })}
      <p id={errorId} role={error ? 'alert' : undefined} className="mt-2 min-h-5 text-sm text-[#e0a08d]">
        {error}
      </p>
    </div>
  )
}

type Props = { preselectedType?: string }

export function Appointment({ preselectedType }: Props) {
  const [values, setValues] = useState<AppointmentValues>(emptyAppointment)
  const [errors, setErrors] = useState<AppointmentErrors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof AppointmentValues, boolean>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const form = useRef<HTMLFormElement>(null)
  const result = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (preselectedType) setValues((v) => ({ ...v, type: preselectedType }))
  }, [preselectedType])

  useEffect(() => {
    if (status === 'sent' || status === 'ready' || status === 'error') result.current?.focus()
  }, [status])

  const set = (key: keyof AppointmentValues) => (e: { target: { value: string } }) => {
    const next = { ...values, [key]: e.target.value }
    setValues(next)
    // Once a field has been visited, keep its message in step with what is typed.
    if (touched[key]) setErrors((prev) => ({ ...prev, [key]: validateAppointment(next)[key] }))
  }

  const blur = (key: keyof AppointmentValues) => () => {
    setTouched((t) => ({ ...t, [key]: true }))
    setErrors((prev) => ({ ...prev, [key]: validateAppointment(values)[key] }))
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const found = validateAppointment(values)
    setErrors(found)
    setTouched(Object.fromEntries(fieldOrder.map((k) => [k, true])))

    const firstInvalid = fieldOrder.find((k) => found[k])
    if (firstInvalid) {
      form.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
      return
    }

    if (!ENDPOINT) {
      setStatus('ready')
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(values),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const reset = () => {
    setValues(emptyAppointment)
    setErrors({})
    setTouched({})
    setStatus('idle')
  }

  const message = appointmentMessage(values)
  const showForm = status === 'idle' || status === 'sending'
  const fade = {
    initial: { opacity: 0, y: reduced ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: reduced ? 0 : -16 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }

  return (
    <section id="appointment" aria-labelledby="appointment-title" className="relative bg-ink py-28 md:py-44">
      <div className="mx-auto grid max-w-[1680px] gap-y-20 px-6 md:px-12 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-5">
          <SectionHeading
            index="05"
            label="Appointments"
            id="appointment-title"
            lines={['Your Perfect Fit', 'Begins Here.']}
          />
          <Reveal as="p" className="mt-10 max-w-md font-serif text-2xl leading-snug text-ivory/80 italic">
            “Every great suit begins with a conversation. Let us create something that is uniquely yours.”
          </Reveal>

          <Reveal className="mt-12">
            <a
              href={whatsappUrl(`Hello ${site.name}, I would like to arrange an appointment.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-5"
            >
              <span className="flex size-12 items-center justify-center rounded-full border border-gold/50 text-gold transition-colors duration-500 ease-lux group-hover:bg-gold group-hover:text-ink">
                <MessageCircle size={18} strokeWidth={1.25} aria-hidden="true" />
              </span>
              <span>
                <span className="eyebrow block text-ivory/50">Prefer to talk?</span>
                <span className="link-line mt-1 inline-block font-serif text-xl">Message us on WhatsApp</span>
              </span>
            </a>
          </Reveal>

          <ParallaxImage
            name="appointment"
            alt="A black tailored suit and tie displayed on a mannequin in front of a brick wall"
            sizes="(min-width: 1024px) 26vw, 0px"
            position="50% 30%"
            className="mt-20 hidden aspect-[3/4] w-[62%] lg:block"
          />
        </div>

        <div className="lg:col-span-6 lg:col-start-7 lg:pt-6">
          <AnimatePresence mode="wait" initial={false}>
            {showForm ? (
              <motion.form
                key="form"
                ref={form}
                onSubmit={submit}
                noValidate
                aria-label="Appointment request"
                className="grid gap-x-10 gap-y-6 sm:grid-cols-2"
                {...fade}
              >
                <Field label="Full Name" error={errors.name} className="sm:col-span-2">
                  {(a) => (
                    <input
                      {...a}
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={values.name}
                      onChange={set('name')}
                      onBlur={blur('name')}
                      className={control}
                    />
                  )}
                </Field>

                <Field label="Phone Number" error={errors.phone}>
                  {(a) => (
                    <input
                      {...a}
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      required
                      value={values.phone}
                      onChange={set('phone')}
                      onBlur={blur('phone')}
                      className={control}
                    />
                  )}
                </Field>

                <Field label="Email Address" error={errors.email}>
                  {(a) => (
                    <input
                      {...a}
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      required
                      value={values.email}
                      onChange={set('email')}
                      onBlur={blur('email')}
                      className={control}
                    />
                  )}
                </Field>

                <Field label="Preferred Appointment Date" error={errors.date}>
                  {(a) => (
                    <input
                      {...a}
                      name="date"
                      type="date"
                      min={todayISO()}
                      required
                      value={values.date}
                      onChange={set('date')}
                      onBlur={blur('date')}
                      className={cn(control, 'min-h-[3.25rem] appearance-none', !values.date && 'text-ivory/40')}
                    />
                  )}
                </Field>

                <Field label="Type of Suit" error={errors.type}>
                  {(a) => (
                    <div className="relative">
                      <select
                        {...a}
                        name="type"
                        required
                        value={values.type}
                        onChange={set('type')}
                        onBlur={blur('type')}
                        className={cn(control, 'min-h-[3.25rem] appearance-none pr-8', !values.type && 'text-ivory/40')}
                      >
                        <option value="" disabled>
                          Select
                        </option>
                        {suitTypes.map((t) => (
                          <option key={t} value={t} className="bg-coal text-ivory">
                            {t}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={16}
                        strokeWidth={1.25}
                        aria-hidden="true"
                        className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 text-gold"
                      />
                    </div>
                  )}
                </Field>

                <Field label="Additional Message" error={errors.message} optional className="sm:col-span-2">
                  {(a) => (
                    <textarea
                      {...a}
                      name="message"
                      rows={3}
                      maxLength={1200}
                      value={values.message}
                      onChange={set('message')}
                      onBlur={blur('message')}
                      className={cn(control, 'resize-none')}
                    />
                  )}
                </Field>

                <div className="mt-2 flex flex-col gap-6 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-xs text-sm leading-relaxed text-ivory/45">
                    Submitting sends a request. Your appointment is confirmed only once we reply to you directly.
                  </p>
                  <button type="submit" disabled={status === 'sending'} className={goldButton('md', 'shrink-0')}>
                    <span className="relative">{status === 'sending' ? 'Sending…' : 'Request Appointment'}</span>
                    <ArrowRight size={14} strokeWidth={1.5} aria-hidden="true" className="relative" />
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="result"
                ref={result}
                tabIndex={-1}
                role="status"
                className="border border-ivory/10 bg-coal p-8 outline-none md:p-12"
                {...fade}
              >
                {status === 'sent' ? (
                  <>
                    <p className="eyebrow text-gold">Request received</p>
                    <h3 className="mt-6 font-serif text-4xl leading-tight font-light md:text-5xl">
                      Thank you, {values.name.trim().split(/\s+/)[0]}.
                    </h3>
                    <p className="mt-6 max-w-md leading-relaxed text-ivory/65">
                      Your request has been sent. This is not yet a confirmed appointment — we will contact you to
                      confirm a date and time.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="eyebrow text-gold">{status === 'error' ? 'Unable to send' : 'One final step'}</p>
                    <h3 className="mt-6 font-serif text-4xl leading-tight font-light md:text-5xl">
                      Your request is ready to send.
                    </h3>
                    <p className="mt-6 max-w-md leading-relaxed text-ivory/65">
                      {status === 'error'
                        ? 'We could not submit your request online, so nothing has been sent yet. '
                        : 'Nothing has been sent yet. '}
                      Choose how you would like to send it to us — your appointment is confirmed only once we reply.
                    </p>
                    {!site.whatsapp && !site.email && (
                      <p className="mt-4 max-w-md text-sm leading-relaxed text-ivory/45">
                        Our contact details have not been added to this website yet, so you will be asked to choose
                        the recipient yourself.
                      </p>
                    )}
                  </>
                )}

                <dl className="mt-10 grid gap-x-10 gap-y-5 border-t border-ivory/10 pt-8 sm:grid-cols-2">
                  {[
                    ['Preferred date', formatDate(values.date)],
                    ['Type of suit', values.type],
                    ['Phone', values.phone.trim()],
                    ['Email', values.email.trim()],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="eyebrow text-ivory/45">{k}</dt>
                      <dd className="mt-2 font-serif text-xl break-words">{v}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                  {status !== 'sent' && (
                    <>
                      <a href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer" className={goldButton()}>
                        <MessageCircle size={15} strokeWidth={1.5} aria-hidden="true" className="relative" />
                        <span className="relative">Send via WhatsApp</span>
                      </a>
                      <a href={mailtoUrl(`Appointment request — ${values.name.trim()}`, message)} className={goldButton()}>
                        <Mail size={15} strokeWidth={1.5} aria-hidden="true" className="relative" />
                        <span className="relative">Send via Email</span>
                      </a>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={status === 'sent' ? reset : () => setStatus('idle')}
                    className="eyebrow link-line self-start text-ivory/60 sm:ml-2 sm:self-auto"
                  >
                    {status === 'sent' ? 'Make another request' : 'Edit details'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
