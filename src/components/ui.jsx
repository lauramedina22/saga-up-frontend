import { useState } from "react"

const toneClasses = {
  primary: "bg-primary-soft text-primary-hover",
  info: "bg-info-soft text-info",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  neutral: "bg-surface-muted text-muted",
}

export function Icon({ path, className = "size-5" }) {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  )
}

const buttonClasses = {
  primary:
    "bg-primary text-foreground shadow-sm hover:bg-primary-hover hover:text-white",
  secondary:
    "border border-border bg-surface text-foreground hover:border-primary/40 hover:bg-primary-soft",
  tertiary: "bg-transparent text-info hover:bg-info-soft",
  danger: "bg-danger text-white hover:bg-danger-hover",
}

export function Button({
  variant = "primary",
  className = "",
  children,
  loading = false,
  ...props
}) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      aria-busy={loading || undefined}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[15px] font-extrabold transition-all hover:brightness-105 active:scale-[0.98] disabled:bg-disabled disabled:text-muted disabled:shadow-none ${buttonClasses[variant]} ${className}`}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
        />
      )}
      {loading ? "Procesando…" : children}
    </button>
  )
}

export function Card({ children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-border bg-surface shadow-card ${className}`}
    >
      {children}
    </section>
  )
}

export function Badge({
  tone = "neutral",
  children,
  className = "",
}) {
  return (
    <span
      className={`inline-flex min-h-7 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-extrabold ${toneClasses[tone]} ${className}`}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  )
}

const avatarTones = [
  "bg-primary text-foreground",
  "bg-info text-white",
  "bg-success text-white",
  "bg-warning-soft text-warning",
  "bg-danger text-white",
]

export function Avatar({ name, size = "md" }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()

  const tone = avatarTones[name.charCodeAt(0) % avatarTones.length]

  const sizeClass =
    size === "sm"
      ? "size-9 text-sm"
      : size === "lg"
        ? "size-16 text-xl"
        : "size-11 text-base"

  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full font-extrabold ${sizeClass} ${tone}`}
    >
      {initials}
    </span>
  )
}

export function Field({
  label,
  hint,
  error,
  valid = false,
  hintClassName = "",
  id,
  className = "",
  ...props
}) {
  const inputId = id ?? `field-${label.toLowerCase().replace(/\s+/g, "-")}`
  const messageId = `${inputId}-message`

  return (
    <label htmlFor={inputId} className="block">
      <span className="mb-1.5 block text-[15px] font-bold text-foreground">
        {label}
      </span>
      <input
        {...props}
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={hint || error ? messageId : undefined}
        className={`min-h-12 w-full rounded-xl border bg-surface px-4 text-base text-foreground outline-none transition placeholder:text-subtle focus:ring-3 focus:ring-primary/15 ${
          error
            ? "border-danger focus:border-danger"
            : valid
              ? "border-success focus:border-success"
              : "border-border focus:border-primary"
        } ${className}`}
      />
      {(error || hint) && (
        <span
          id={messageId}
          className={`mt-1.5 block text-sm ${
            error
              ? "font-semibold text-danger"
              : hintClassName
                ? ""
                : "text-muted"
          } ${hintClassName}`}
        >
          {error ?? hint}
        </span>
      )}
    </label>
  )
}

export function PasswordField({ label, id, ...props }) {
  const [visible, setVisible] = useState(false)
  const inputId = id ?? `field-${label.toLowerCase().replace(/\s+/g, "-")}`
  const messageId = `${inputId}-message`
  const { hint, error, valid = false, hintClassName = "", className = "", ...inputProps } = props

  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-[15px] font-bold text-foreground"
      >
        {label}
      </label>
      <div className="relative">
        <input
          {...inputProps}
          id={inputId}
          type={visible ? "text" : "password"}
          aria-invalid={Boolean(error)}
          aria-describedby={hint || error ? messageId : undefined}
          className={`min-h-12 w-full rounded-xl border bg-surface px-4 pr-12 text-base text-foreground outline-none transition placeholder:text-subtle focus:ring-3 focus:ring-primary/15 ${
            error
              ? "border-danger focus:border-danger"
              : valid
                ? "border-success focus:border-success"
                : "border-border focus:border-primary"
          } ${className}`}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          aria-pressed={visible}
          className="absolute inset-y-0 right-1 flex w-10 items-center justify-center rounded-lg text-muted transition-colors hover:text-foreground"
        >
          {visible ? (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4.2 9.5 7-.4 1.1-1.2 2.3-2.3 3.3M6.2 6.2C4.3 7.4 3 9.3 2.5 12c.7 2.1 3.9 7 9.5 7 1.4 0 2.6-.3 3.7-.8"
              />
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.5 12c.7-2.1 3.9-7 9.5-7s8.8 4.9 9.5 7c-.7 2.1-3.9 7-9.5 7s-8.8-4.9-9.5-7z"
              />
              <circle cx="12" cy="12" r="2.5" />
            </svg>
          )}
        </button>
      </div>
      {(error || hint) && (
        <span
          id={messageId}
          className={`mt-1.5 block text-sm ${
            error
              ? "font-semibold text-danger"
              : hintClassName
                ? ""
                : "text-muted"
          } ${hintClassName}`}
        >
          {error ?? hint}
        </span>
      )}
    </div>
  )
}

export function SelectField({ label, id, children, ...props }) {
  const inputId = id ?? `field-${label.toLowerCase().replace(/\s+/g, "-")}`

  return (
    <label htmlFor={inputId} className="block">
      <span className="mb-1.5 block text-[15px] font-bold text-foreground">
        {label}
      </span>
      <span className="relative block">
        <select
          {...props}
          id={inputId}
          className={`min-h-12 w-full appearance-none rounded-xl border border-border bg-surface px-4 pr-10 text-base text-foreground outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15 ${props.className ?? ""}`}
        >
          {children}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 9l6 6 6-6"
          />
        </svg>
      </span>
    </label>
  )
}

export function TextArea({
  label,
  hint,
  id,
  className = "",
  ...props
}) {
  const inputId = id ?? `field-${label.toLowerCase().replace(/\s+/g, "-")}`

  return (
    <label htmlFor={inputId} className="block">
      <span className="mb-1.5 block text-[15px] font-bold text-foreground">
        {label}
      </span>
      <textarea
        {...props}
        id={inputId}
        className={`w-full resize-y rounded-xl border border-border bg-surface p-4 text-base text-foreground outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15 ${className}`}
      />
      {hint && <span className="mt-1.5 block text-sm text-muted">{hint}</span>}
    </label>
  )
}

export function PageHeader({ title, description, action }) {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-[2rem] font-extrabold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1 text-base text-muted">{description}</p>
        )}
      </div>
      {action}
    </header>
  )
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-10 text-center">
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-success-soft text-success">
        <Icon path="M4.5 12.75l6 6 9-13.5" className="size-6" />
      </div>
      <h3 className="text-xl font-extrabold">{title}</h3>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}