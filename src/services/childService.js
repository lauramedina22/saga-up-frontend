import apiClient from "../api/apiClient"

const CHILDREN_ENDPOINT = "/children"

function getChildList(response) {
  const children = Array.isArray(response)
    ? response
    : response?.children

  if (!Array.isArray(children)) {
    throw new Error("La respuesta del servidor no contiene una lista de children.")
  }

  return children
}

function getChildRecord(response) {
  const child = response?.child ?? response

  if (!child || typeof child !== "object" || !child.id) {
    throw new Error("La respuesta del servidor no contiene un beneficiario válido.")
  }

  return child
}

export const childService = {
  async getChildrenData() {
    const response = await apiClient.get(CHILDREN_ENDPOINT)
    const children = getChildList(response)

    return {
      children,
      enrollments: response?.enrollments ?? [],
      payments: response?.payments ?? [],
      sponsors: response?.sponsors ?? [],
    }
  },

  async createChild(data) {
    const { guardianId, guardianIds, ...childData } = data
    return getChildRecord(
      await apiClient.post(CHILDREN_ENDPOINT, childData),
    )
  },

  async updateChild(id, changes) {
    return getChildRecord(
      await apiClient.put(`${CHILDREN_ENDPOINT}/${id}`, changes),
    )
  },

  async deleteChild(id) {
    return apiClient.delete(`${CHILDREN_ENDPOINT}/${id}`)
  },
}
