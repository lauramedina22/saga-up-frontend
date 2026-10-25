import { useState } from "react"
import logoSaga from "../imports/texto.png"
import { Button, Field, PasswordField } from "../components/ui"

export default function LoginScreen({
  onLogin,
  onGoToRegister,
  loading,
  error,
}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (event) => {
    event.preventDefault()
    onLogin(email, password)
  }

  return (
    <main className="relative flex min-h-screen w-full flex-col overflow-hidden bg-white md:flex-row">
      {/* Fondo base para escritorio (mantiene tu diseño original) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-[74%] bg-[linear-gradient(to_right,#02bdb1_0%,#b9e9e6_30%,#e8f7f6_60%,#ffffff_100%)] md:block"
      />
      
      <div className="relative flex min-h-[25vh] w-full items-center justify-center overflow-hidden bg-linear-to-br from-[#02bdb1] via-teal-50 to-teal-100 p-8 md:min-h-0 md:w-1/2 md:bg-none md:p-16">
        <div className="z-10 flex flex-col items-center text-center">
          <img
            src={logoSaga}
            alt="SAGA UP - Sistema de Administración y Gestión de Asisco Up"
            className="w-full max-w-75 object-contain md:max-w-lg"
          />
        </div>
      </div>

      {/* COLUMNA DERECHA: Formulario de Login */}
      <div className="z-10 flex w-full flex-col justify-center bg-white p-8 md:w-1/2 md:bg-transparent md:p-20 lg:p-24">
        <div className="mx-auto w-full max-w-md">
          
          <div className="mb-8">
            <h1 className="mb-1 text-2xl font-extrabold text-gray-900 sm:text-3xl">
              ¡Hola! Te damos la bienvenida
            </h1>
            <p className="text-sm text-gray-500">
              Ingresa con tu cuenta al sistema
            </p>
          </div>

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
            <PasswordField
              label="Contraseña"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              placeholder="Escribe tu contraseña"
            />
            
            <div className="flex items-center justify-end">
              <a href="#forgot" className="text-xs font-medium text-teal-600 hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {error && (
              <p className="text-sm font-semibold text-danger" role="alert">
                {error}
              </p>
            )}

            <Button 
              type="submit" 
              loading={loading} 
              className="mt-2 w-full rounded-xl bg-teal-600 py-3 font-bold text-white shadow-md transition-all hover:bg-teal-700"
            >
              Entrar
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            <span>¿Aún no tienes cuenta? </span>
            <button
              type="button"
              onClick={onGoToRegister}
              className="font-bold text-teal-600 underline-offset-4 hover:underline"
            >
              Regístrate
            </button>
          </div>

        </div>
      </div>

    </main>
  )
}