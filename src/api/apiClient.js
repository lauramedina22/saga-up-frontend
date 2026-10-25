function getApiUrl() {
  const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, "")
  if (!apiUrl) {
    throw new Error("Falta configurar VITE_API_URL en el archivo .env.")
  }
  return apiUrl
}

async function post(path, body) {
  const response = await fetch(`${getApiUrl()}${path}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
  const responseBody = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      (typeof responseBody?.message === "string" && responseBody.message) ||
      (typeof responseBody?.mensaje === "string" && responseBody.mensaje) ||
      (response.status === 401
        ? "Correo o contraseña incorrectos."
        : `La solicitud falló (error ${response.status}).`)
    const error = new Error(message)
    error.status = response.status
    error.data = responseBody
    throw error
  }

  return responseBody
}

export default { post }
