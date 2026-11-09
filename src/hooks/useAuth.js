// Un Hook es la herramienta que permite a la pantalla recordar cosas y reaccionar cuando algo cambia

import { useEffect, useState } from "react"
import { authService } from "../services/authService"

const SESSION_KEY = "saga-up-session"

function getSavedSession() {
  // Busca si hay una sesión previa guardada en la memoria del navegador
  const savedSession = sessionStorage.getItem(SESSION_KEY)
  if (!savedSession) return null // Si no hay nada, no hay sesión activa

  try {
    // Intenta convertir el texto guardado a un objeto JS
    const session = JSON.parse(savedSession)
    // Valida que el objeto tenga un token de texto válido. Si es así, retorna la sesión
    if (typeof session?.token === "string" && session.token) return session
  } catch {

    //Si el JSON está roto o corrupto (lanza un error), limpia la memoria
    sessionStorage.removeItem(SESSION_KEY)
    return null
  }
  // Si el JSON era válido pero NO tenía token, limpia los datos incompletos
  sessionStorage.removeItem(SESSION_KEY)
  return null
}

function getErrorMessage(error) {
  if (error instanceof TypeError) {
    return "No se pudo conectar con el servidor. Revisa la URL y la configuración CORS."
  }
  return error.message || "Ocurrió un error inesperado."
}

export function useAuth() {
  const [session, setSession] = useState(getSavedSession)
  const [loginLoading, setLoginLoading] = useState(false) // Indica si la petición HTTP hacia el backend en Render está en proceso
  const [loginError, setLoginError] = useState("") // Almacena el mensaje de error en texto plano para mostrárselo al usuario si algo sale mal
  const [registerLoading, setRegisterLoading] = useState(false)
  const [registerError, setRegisterError] = useState("")
  const [registerSuccess, setRegisterSuccess] = useState("")

  useEffect(() => {
    if (!session) return undefined

    let reloadStarted = false
    const reloadIfSessionWasRemoved = () => {
      if (reloadStarted) return

      const savedSession = sessionStorage.getItem(SESSION_KEY)
      let hasToken = false

      if (savedSession) {
        try {
          const parsedSession = JSON.parse(savedSession)
          hasToken =
            typeof parsedSession?.token === "string" &&
            parsedSession.token.length > 0
        } catch {
          hasToken = false
        }
      }

      if (!hasToken) {
        reloadStarted = true
        window.location.reload()
      }
    }

    window.addEventListener("storage", reloadIfSessionWasRemoved)
    const intervalId = window.setInterval(reloadIfSessionWasRemoved, 250)

    return () => {
      window.removeEventListener("storage", reloadIfSessionWasRemoved)
      window.clearInterval(intervalId)
    }
  }, [session])

  const login = async (email, password) => {
    setLoginError("")
    setLoginLoading(true)

    try {
      // Llama al servicio que se conecta con la API en Render
      const nextSession = await authService.login({
        email,
        clave: password, // <-- Traduces 'password' a 'clave' justo antes de enviar
        
      })

      // Si las credenciales son correctas, guarda la sesión en el navegador
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(nextSession))

      //  Guarda la sesión en el estado de React (para que la app sepa que ya entraste)
      setSession(nextSession)
      return true

    } catch (error) {
      setLoginError(getErrorMessage(error))
      return false
    } finally {
      setLoginLoading(false)
    }
  }

  const register = async (userData) => {
    setRegisterError("")
    setRegisterSuccess("")
    setRegisterLoading(true)

    try {
      await authService.register(userData)

      
      // Como la API solo confirma el registro, seteamos el mensaje directamente
      setRegisterSuccess("Tu cuenta fue creada. Ya puedes iniciar sesión.")
    } catch (error) {
      setRegisterError(getErrorMessage(error))
    } finally {
      setRegisterLoading(false)
    }
  }

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setSession(null)
  }

  return {
    session,
    login,
    loginLoading,
    loginError,
    register,
    registerLoading,
    registerError,
    registerSuccess,
    logout,
  }
}
