import apiClient from "../api/apiClient"
import { toChildModel, toChildPayload } from "../models/childModel.js"

const CHILDREN_ENDPOINT = "/children"

function getChildList(response) {
  const children = Array.isArray(response) ? response : response?.children

  if (!Array.isArray(children)) {
    throw new Error("La respuesta del servidor no contiene una lista de children.")
  }

  return children.map(toChildModel)
}

function getChildRecord(response) {
  const rawChild = response?.child ?? response
  const child = toChildModel(rawChild)

  if (!child.childId) {
    throw new Error("La respuesta del servidor no contiene un child válido.")
  }

  return child
}

export const childService = {
  async getChildrenData() {
    const response = await apiClient.get(CHILDREN_ENDPOINT)
    return { children: getChildList(response) }
  },

  async createChild(child) {
    return getChildRecord(
      await apiClient.post(CHILDREN_ENDPOINT, toChildPayload(child)),
    )
  },

  async updateChild(childId, changes) {
    return getChildRecord(
      await apiClient.put(
        `${CHILDREN_ENDPOINT}/${childId}`,
        toChildPayload(changes),
      ),
    )
  },

  async deleteChild(childId) {
    return apiClient.delete(`${CHILDREN_ENDPOINT}/${childId}`)
  },
}
