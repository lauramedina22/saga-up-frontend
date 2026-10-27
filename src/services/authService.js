import { authApiClient as apiClient } from "../api/apiClient"

// authService  sabe a DONDE ir (pone la ruta y datos del usuario)

export const authService = {
  async login(credentials) {
    const data = await apiClient.post("/auth/login", credentials)
    if (typeof data?.token !== "string" || !data.token) {
      throw new Error("La respuesta del servidor no incluye un token válido.")
    }
    return {
      ...data,
      roles: Array.isArray(data.usuario.roles) ? data.usuario.roles : [],
    }
  },

  register(userData) {
    return apiClient.post("/auth/registro", userData)
  },
}
