import apiClient from "../api/apiClient"

const GUARDIANS_ENDPOINT = "/guardians"

function getGuardianList(response) {
  const guardians = Array.isArray(response)? response : response?.guardians

  if (!Array.isArray(guardians)) {
    throw new Error("La respuesta del servidor no contiene una lista de guardians.")
  }

  return guardians
}

function getGuardianRecord(response) {
  const guardian = response?.guardian ?? response

  if (!guardian || typeof guardian !== "object" || !guardian.id) {
    throw new Error("La respuesta del servidor no contiene un guardian válido.")
  }

  return guardian
}

export const guardianService = {
  async getGuardianData() {
    const response = await apiClient.get(GUARDIANS_ENDPOINT)
    return { guardians: getGuardianList(response) }
  },

  async createGuardian(data) {
    const { childrenIds, ...guardianData } = data
    return getGuardianRecord(
      await apiClient.post(GUARDIANS_ENDPOINT, guardianData),
    )
  },

  async deleteGuardian(id) {
    return apiClient.delete(`${GUARDIANS_ENDPOINT}/${id}`)
  },
}
