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
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[15px] font-extrabold transition-colors disabled:bg-disabled disabled:text-muted disabled:shadow-none ${buttonClasses[variant]} ${className}`}
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
        className={`min-h-12 w-full rounded-xl border bg-surface px-4 text-base text-foreground outline-none transition placeholder:text-subtle focus:border-primary focus:ring-3 focus:ring-primary/15 ${
          error ? "border-danger" : "border-border"
        } ${className}`}
      />
      {(error || hint) && (
        <span
          id={messageId}
          className={`mt-1.5 block text-sm ${
            error ? "font-semibold text-danger" : "text-muted"
          }`}
        >
          {error ?? hint}
        </span>
      )}
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