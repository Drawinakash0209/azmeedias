import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowRight, ChevronDown, MessageCircle, Phone } from 'lucide-react'
import { placeholders, site, telUrl, whatsappUrl } from '../config/site'
import { enquiryTypes } from '../data/content'
import {
  appointmentMessage,
  emptyAppointment,
  formatDate,
  todayISO,
  validateAppointment,
  type AppointmentErrors,
  type AppointmentValues,
} from '../lib/appointment'
import { button } from '../components/ui/Button'
import { ParallaxImage } from '../components/ui/ParallaxImage'
import { Reveal } from '../components/ui/Reveal'
import { SectionBar, SectionHeading } from '../components/ui/SectionHeading'
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
const fieldOrder: Array<keyof AppointmentValues> = ['name', 'phone', 'date', 'type', 'message']
const control =
  'peer w-full border-b border-ink/15 bg-transparent py-3 text-lg font-light text-ink outline-none transition-colors duration-500 placeholder:text-ink/30 hover:border-ink/40 focus:border-gold-deep aria-[invalid=true]:border-[#b5523b]'

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
      <label htmlFor={id} className="eyebrow flex justify-between text-stone">
        {label}
        {optional && <span className="tracking-[0.2em] text-stone/60">Optional</span>}
      </label>
      {children({ id, 'aria-invalid': !!error, 'aria-describedby': error ? errorId : undefined })}
      <p id={errorId} role={error ? 'alert' : undefined} className="mt-2 min-h-5 text-sm text-[#a8452f]">
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
    <section id="appointment" aria-labelledby="appointment-title" className="relative bg-cream">
      <SectionBar index="08" label="Appointments" />
      <div className="mx-auto max-w-[1600px] px-5 pt-20 md:px-10 md:pt-28">
        <SectionHeading id="appointment-title" lines={[['Book an', 'appointment']]} />
      </div>
      <div className="mx-auto grid max-w-[1600px] gap-y-14 px-5 pt-14 pb-24 md:px-10 md:pt-20 md:pb-32 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-4">
          <Reveal as="p" className="max-w-sm text-[0.95rem] leading-[1.6] text-stone">
            Tell us what you need and roughly when. We&rsquo;ll reply to confirm a time for your first consultation.
          </Reveal>

          <Reveal className="mt-12">
            <div className="flex flex-col gap-6">
              <a href={telUrl() ?? '#contact'} className="group inline-flex items-center gap-5">
                <span className="flex size-12 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors duration-500 ease-lux group-hover:border-ink group-hover:bg-ink group-hover:text-paper">
                  <Phone size={17} strokeWidth={1.25} aria-hidden="true" />
                </span>
                <span>
                  <span className="eyebrow block text-stone">Prefer to talk?</span>
                  <span className="link-line mt-1 inline-block text-[1.1rem]">Call {site.phone ?? placeholders.phone}</span>
                </span>
              </a>
              <a
                href={whatsappUrl(`Hello ${site.name}, I would like to arrange an appointment.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-5"
              >
                <span className="flex size-12 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors duration-500 ease-lux group-hover:border-ink group-hover:bg-ink group-hover:text-paper">
                  <MessageCircle size={18} strokeWidth={1.25} aria-hidden="true" />
                </span>
                <span>
                  <span className="eyebrow block text-stone">Or message us</span>
                  <span className="link-line mt-1 inline-block text-[1.1rem]">WhatsApp</span>
                </span>
              </a>
            </div>
          </Reveal>

          <div className="mt-16 hidden grid-cols-2 gap-4 lg:grid">
            <ParallaxImage
              name="bridal-lace-sheer"
              alt="Close view of floral lace on a wedding gown"
              sizes="(min-width: 1024px) 18vw, 0px"
              className="aspect-[4/5]"
            />
            <ParallaxImage
              name="appointment"
              alt="A black tailored suit and tie displayed on a mannequin"
              sizes="(min-width: 1024px) 18vw, 0px"
              position="50% 30%"
              className="aspect-[4/5]"
            />
          </div>
        </div>

        <div className="border border-ink/15 bg-white p-6 sm:p-9 md:p-12 lg:col-span-8 lg:self-start">
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
                      className={cn(control, 'min-h-[3.25rem] appearance-none', !values.date && 'text-stone')}
                    />
                  )}
                </Field>

                <Field label="What are you looking for?" error={errors.type} className="sm:col-span-2">
                  {(a) => (
                    <div className="relative">
                      <select
                        {...a}
                        name="type"
                        required
                        value={values.type}
                        onChange={set('type')}
                        onBlur={blur('type')}
                        className={cn(control, 'min-h-[3.25rem] appearance-none pr-8', !values.type && 'text-stone')}
                      >
                        <option value="" disabled>
                          Select
                        </option>
                        {enquiryTypes.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={16}
                        strokeWidth={1.25}
                        aria-hidden="true"
                        className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 text-gold-deep"
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
                  <p className="max-w-xs text-sm leading-relaxed text-stone">
                    Submitting sends a request. Your appointment is confirmed only once we reply to you directly.
                  </p>
                  <button type="submit" disabled={status === 'sending'} className={button('dark', 'md', 'shrink-0')}>
                    <span className="relative">{status === 'sending' ? 'Sending…' : 'Request a Consultation'}</span>
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
                className="outline-none"
                {...fade}
              >
                {status === 'sent' ? (
                  <>
                    <p className="eyebrow text-gold-deep">Request received</p>
                    <h3 className="display mt-6 text-4xl md:text-5xl">
                      Thank you, {values.name.trim().split(/\s+/)[0]}.
                    </h3>
                    <p className="mt-6 max-w-md leading-relaxed text-stone">
                      Your request has been sent. This is not a confirmed appointment yet. We will contact you to
                      confirm a date and time.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="eyebrow text-gold-deep">{status === 'error' ? 'Unable to send' : 'One final step'}</p>
                    <h3 className="display mt-6 text-4xl md:text-5xl">
                      Your request is ready to send.
                    </h3>
                    <p className="mt-6 max-w-md leading-relaxed text-stone">
                      {status === 'error'
                        ? 'We could not submit your request online, so nothing has been sent yet. '
                        : 'Nothing has been sent yet. '}
                      Send it to us on WhatsApp, or call us. Your appointment is confirmed once we reply.
                    </p>
                    {!site.whatsapp && (
                      <p className="mt-4 max-w-md text-sm leading-relaxed text-stone">
                        Our WhatsApp number has not been added to this website yet, so you will be asked to choose
                        the chat yourself.
                      </p>
                    )}
                  </>
                )}

                <dl className="mt-10 grid gap-x-10 gap-y-5 border-t border-ink/10 pt-8 sm:grid-cols-2">
                  {[
                    ['Preferred date', formatDate(values.date)],
                    ['Looking for', values.type],
                    ['Phone', values.phone.trim()],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="eyebrow text-stone">{k}</dt>
                      <dd className="mt-2 text-[1.1rem] break-words">{v}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                  {status !== 'sent' && (
                    <>
                      <a href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer" className={button('dark')}>
                        <MessageCircle size={15} strokeWidth={1.5} aria-hidden="true" className="relative" />
                        <span className="relative">Send via WhatsApp</span>
                      </a>
                      <a href={telUrl() ?? '#contact'} className={button('outline')}>
                        <Phone size={15} strokeWidth={1.5} aria-hidden="true" className="relative" />
                        <span className="relative">Call us</span>
                      </a>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={status === 'sent' ? reset : () => setStatus('idle')}
                    className="eyebrow link-line self-start text-stone sm:ml-2 sm:self-auto"
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
