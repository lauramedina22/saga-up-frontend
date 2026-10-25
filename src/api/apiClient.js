const SESSION_KEY = "saga-up-session"

function getApiUrl() {
  const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, "")
  if (!apiUrl) {
    throw new Error("Falta configurar VITE_API_URL en el archivo .env.")
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

async function request(method, path, body = null) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  }
  const authorization = getAuthorizationHeader()
  if (authorization) headers.Authorization = authorization

  const options = { method, headers }
  if (body !== null) options.body = JSON.stringify(body)

  const response = await fetch(`${getApiUrl()}${path}`, options)
  const responseBody = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      (typeof responseBody?.message === "string" && responseBody.message) ||
      (typeof responseBody?.mensaje === "string" && responseBody.mensaje) ||
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

async function get(path) {
  return request("GET", path)
}

async function post(path, body) {
  return request("POST", path, body)
}

async function put(path, body) {
  return request("PUT", path, body)
}

async function del(path) {
  return request("DELETE", path)
}

export default { get, post, put, delete: del }
