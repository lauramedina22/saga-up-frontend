import apiClient from "../api/apiClient"
import { toChildModel, toChildPayload } from "../models/childModel"

const CHILDREN_ENDPOINT = "/children"

function getChildList(response) {
  const children = Array.isArray(response)
    ? response
    : response?.children

  if (!Array.isArray(children)) {
    throw new Error("La respuesta del servidor no contiene una lista de children.")
  }

  return children.map(toChildModel)
}

function getChildRecord(response) {
  const rawChild = response?.child ?? response

  if (!rawChild || typeof rawChild !== "object") {
    throw new Error("La respuesta del servidor no contiene un beneficiario válido.")
  }

  const child = toChildModel(rawChild)
  if (!child.id) {
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
      payments: response?.payments ?? response?.tuition ?? [],
      sponsors: response?.sponsors ?? [],
    }
  },

  async createChild(data) {
    const { guardianId, guardianIds, ...childData } = data
    return getChildRecord(
      await apiClient.post(CHILDREN_ENDPOINT, toChildPayload(childData)),
    )
  },

  async updateChild(id, changes) {
    return getChildRecord(
      await apiClient.put(
        `${CHILDREN_ENDPOINT}/${id}`,
        toChildPayload(changes),
      ),
    )
  },

  async deleteChild(id) {
    return apiClient.delete(`${CHILDREN_ENDPOINT}/${id}`)
  },
}
