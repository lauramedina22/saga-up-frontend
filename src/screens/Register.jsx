import { useState } from "react"
import logo from "../imports/logo.png"
import {
  Button,
  Field,
  PasswordField,
  SelectField,
} from "../components/ui"

export default function RegisterScreen({
  onRegister,
  onBackToLogin,
  loading = false,
  error = "",
  success = "",
}) {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState("ACUDIENTE")
  const passwordMismatch =
    confirmPassword.length > 0 && password !== confirmPassword
  const passwordMatches =
    confirmPassword.length > 0 && password === confirmPassword

  const handleSubmit = (event) => {
    event.preventDefault()
    if (passwordMismatch || password.length < 12) return

    onRegister?.({ username, email, clave: password, rol: role })
  }

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-y-auto bg-background p-4">
      <div
        aria-hidden="true"
        className="absolute -left-24 top-12 size-72 rounded-full bg-info-soft blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -right-24 bottom-12 size-72 rounded-full bg-primary-soft blur-3xl"
      />
      <section className="animate-enter relative my-4 flex w-full max-w-md flex-col items-center gap-5 rounded-3xl border border-border bg-surface p-6 shadow-dialog sm:p-9">
        <div className="flex h-32 w-48 items-center justify-center">
          <img
            src={logo}
            alt="ASISCO UP"
            className="h-full w-full object-contain mix-blend-multiply"
          />
        </div>
        <div className="w-full">
          <h1 className="mb-1 text-center text-3xl font-extrabold">
            Crear una cuenta
          </h1>
          <p className="mb-6 text-center text-sm text-muted">
            Regístrate en SAGA-UP
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field
              label="Nombre de usuario"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              placeholder="Tu nombre de usuario"
            />
            <Field
              label="Correo electrónico"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="correo@ejemplo.com"
            />
            <SelectField
              label="Tipo de cuenta"
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              <option value="ACUDIENTE">Acudiente</option>
              <option value="DONANTE">Donante</option>
            </SelectField>
            <PasswordField
              label="Contraseña"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={12}
              hint="Debe tener al menos 12 caracteres."
              hintClassName={
                password.length >= 12 ? "font-semibold text-success" : ""
              }
              placeholder="Crea una contraseña"
            />
            <PasswordField
              label="Confirmar contraseña"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              minLength={12}
              error={
                passwordMismatch ? "Las contraseñas no coinciden." : undefined
              }
              valid={passwordMatches}
              placeholder="Escribe la contraseña de nuevo"
            />
            {error && (
              <p className="text-sm font-semibold text-danger" role="alert">
                {error}
              </p>
            )}
            {success && (
              <p className="text-sm font-semibold text-success" role="status">
                {success}
              </p>
            )}
            <Button type="submit" loading={loading} className="mt-2 w-full">
              Crear cuenta
            </Button>
          </form>

          <div className="mt-5 text-center text-sm text-muted">
            <span>¿Ya tienes cuenta? </span>
            <button
              type="button"
              onClick={onBackToLogin}
              className="font-bold text-info underline-offset-4 hover:underline"
            >
              Inicia sesión
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}