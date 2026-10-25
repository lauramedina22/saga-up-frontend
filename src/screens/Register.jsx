import { useState } from "react"
import logoSaga from "../imports/texto.png"
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
    <main className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-white md:flex-row">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-[74%] bg-[linear-gradient(to_right,#02bdb1_0%,#b9e9e6_30%,#e8f7f6_60%,#ffffff_100%)] md:block"
      />

      <div className="relative flex min-h-[25vh] w-full items-center justify-center overflow-hidden bg-linear-to-br from-[#02bdb1] via-teal-50 to-teal-100 p-8 md:min-h-screen md:w-1/2 md:bg-none md:p-16">
        <div className="z-10 flex flex-col items-center text-center">
          <img
            src={logoSaga}
            alt="SAGA UP - Sistema de Administración y Gestión de Asisco Up"
            className="w-full max-w-75 object-contain md:max-w-lg"
          />
        </div>
      </div>

      <div className="z-10 flex w-full flex-col justify-center bg-white px-8 py-10 md:w-1/2 md:bg-transparent md:px-16 md:py-12 lg:px-24">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <h1 className="mb-1 text-2xl font-extrabold text-gray-900 sm:text-3xl">
              Crear una cuenta
            </h1>
            <p className="text-sm text-gray-500">
              Regístrate en SAGA-UP
            </p>
          </div>

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

          <div className="mt-8 text-center text-sm text-gray-500">
            <span>¿Ya tienes cuenta? </span>
            <button
              type="button"
              onClick={onBackToLogin}
              className="font-bold text-teal-600 underline-offset-4 hover:underline"
            >
              Inicia sesión
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}