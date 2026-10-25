import { useState } from "react"
import logoSaga from "../imports/texto.png" // Ajusta la ruta a tu imagen de SAGA UP
import manos from "../imports/manos.png"        // Tu imagen de las manitos
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
    <main className="flex min-h-screen w-full flex-col md:flex-row bg-white overflow-hidden">
      
      {/* COLUMNA IZQUIERDA: Gradiente, Logo centrado y Manos abajo con difuminado */}
      <div className="relative flex w-full flex-col justify-between bg-linear-to-br from-amber-100 via-teal-50 to-teal-100 p-8 md:w-1/2 md:p-16 overflow-hidden">
        
        {/* Logo SAGA UP (Imagen) Centrado Arriba */}
        <div className="flex flex-col items-center text-center mt-6 z-10">
          <img
            src={logoSaga}
            alt="SAGA UP - Sistema de Administración y Gestión de Asisco Up"
            className="w-full max-w-md object-contain"
          />
        </div>

        {/* Espaciador flexible para empujar las manos hacia abajo */}
        <div className="flex-grow"></div>

        {/* Contenedor de las manos con el difuminado superior aplicado en CSS */}
        <div className="absolute bottom-0 left-0 right-0 w-full pointer-events-none">
          <img
            src={manos}
            alt="Manos colaborativas"
            className="w-full object-cover object-bottom opacity-95"
            style={{
              maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 65%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 65%, rgba(0,0,0,0) 100%)'
            }}
          />
        </div>
      </div>

      {/* COLUMNA DERECHA: Formulario de Login */}
      <div className="flex w-full flex-col justify-center p-8 md:w-1/2 md:p-20 lg:p-24 bg-white z-10">
        <div className="w-full max-w-md mx-auto">
          
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
              className="mt-2 w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl transition-all shadow-md"
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