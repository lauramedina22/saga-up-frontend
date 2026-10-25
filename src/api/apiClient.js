function getApiUrl() {
  const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, "")
  if (!apiUrl) {
    throw new Error("Falta configurar VITE_API_URL en el archivo .env.")
  }
  return apiUrl
}

// Función central para no repetir la lógica de fetch y errores
async function request(method, path, body = null) {
  const options = {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }

  if (body) {
    options.body = JSON.stringify(body)
  }

  // Nota: Si tus rutas de estudiantes están protegidas, 
  // aquí es el lugar perfecto para inyectar el token en el futuro:
  // const session = JSON.parse(sessionStorage.getItem("saga-up-session"))
  // if (session?.token) {
  //   options.headers.Authorization = `Bearer ${session.token}`
  // }

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

// Envoltorios limpios para cada verbo HTTP
async function get(path) {
  return request("GET", path)
}

async function post(path, body) {
  return request("POST", path, body)
}

async function put(path, body) {
  return request("PUT", path, body)
}

// Usamos 'del' porque 'delete' es una palabra reservada en JavaScript
async function del(path) {
  return request("DELETE", path)
}

export default { 
  get, 
  post, 
  put, 
  delete: del 
}