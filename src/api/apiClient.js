const SESSION_KEY = "saga-up-session"

// Backend de negocio (localhost:3000) y servicio de autenticación (emite el token)
const BASE_URLS = {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_AUTH_API_URL: import.meta.env.VITE_AUTH_API_URL,
}

function getApiUrl(envKey = "VITE_API_URL") {
  const apiUrl = BASE_URLS[envKey]?.replace(/\/+$/, "")
  if (!apiUrl) {
    throw new Error(`Falta configurar ${envKey} en el archivo .env.`)
  }
  return apiUrl
}

function getAuthorizationHeader() {
  const savedSession = sessionStorage.getItem(SESSION_KEY)
  if (!savedSession) return null

  try {
    const session = JSON.parse(savedSession)
    return typeof session?.token === "string" && session.token
      ? `Bearer ${session.token}`
      : null
  } catch {
    sessionStorage.removeItem(SESSION_KEY)
    return null
  }
}

async function request(envKey, method, path, body = null) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  }
  const authorization = getAuthorizationHeader()
  if (authorization) headers.Authorization = authorization

  const options = { method, headers }
  if (body !== null) options.body = JSON.stringify(body)

  const response = await fetch(`${getApiUrl(envKey)}${path}`, options)
  const responseBody = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      (typeof responseBody?.message === "string" && responseBody.message) ||
      (typeof responseBody?.mensaje === "string" && responseBody.mensaje) ||
      (typeof responseBody?.error === "string" && responseBody.error) ||
      (response.status === 401
        ? "Acceso denegado o credenciales incorrectas."
        : `La solicitud falló (error ${response.status}).`)

    const error = new Error(message)
    error.status = response.status
    error.data = responseBody
    throw error
  }

  return responseBody
}

function createClient(envKey) {
  return {
    get: (path) => request(envKey, "GET", path),
    post: (path, body) => request(envKey, "POST", path, body),
    put: (path, body) => request(envKey, "PUT", path, body),
    delete: (path) => request(envKey, "DELETE", path),
  }
}

// Cliente para el servicio de autenticación (login / registro)
export const authApiClient = createClient("VITE_AUTH_API_URL")

// Cliente para el backend de negocio
export default createClient("VITE_API_URL")
