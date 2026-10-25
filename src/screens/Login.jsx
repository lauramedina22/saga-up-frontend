import { useState } from "react"
import logo from "../imports/logo.png"
import { Button, Field } from "../components/ui"

export default function LoginScreen({ onLogin, loading, error }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (event) => {
    event.preventDefault()
    onLogin(email, password)
  }

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background p-4">
      <div
        aria-hidden="true"
        className="absolute -left-24 top-12 size-72 rounded-full bg-info-soft blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -right-24 bottom-12 size-72 rounded-full bg-primary-soft blur-3xl"
      />
      <section className="animate-enter relative flex w-full max-w-md flex-col items-center gap-6 rounded-3xl border border-border bg-surface p-6 shadow-dialog sm:p-9">
        <div className="flex flex-col items-center gap-2">
          <img src={logo} alt="ASISCO UP" className="w-48 object-contain" />
          <p className="text-center font-heading text-sm font-bold text-info">
            ¡No somos Down, somos UP!
          </p>
        </div>

        <div className="h-px w-full bg-border" />

        <div className="w-full">
          <h1 className="mb-1 text-center text-3xl font-extrabold">
            Bienvenid@ a SAGA-UP
          </h1>
          <p className="mb-6 text-center text-sm text-muted">
            Ingresa con tu cuenta
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field
              label="Correo electrónico"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="correo@asiscoup.org"
            />
            <Field
              label="Contraseña"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              placeholder="Escribe tu contraseña"
            />
            {error && (
              <p className="text-sm font-semibold text-danger" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" loading={loading} className="mt-2 w-full">
              Entrar
            </Button>
          </form>
          <div className="mt-5 text-center text-sm text-muted">
            <span>¿Aún no tienes cuenta? </span>
            <span className="font-bold text-info">
              Regístrate
            </span>
          </div>
        </div>
      </section>

    </main>
  )
}