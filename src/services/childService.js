import apiClient from "../api/apiClient"
import { readList, readRecord } from "../models/modelUtils.js"
import { toChildModel, toChildPayload } from "../models/childModel.js"

const CHILDREN_ENDPOINT = "/children"

function getChildList(response) {
  const children = readList(response, "children")

  if (!Array.isArray(children)) {
    throw new Error("La respuesta del servidor no contiene una lista de children.")
  }

  return children.map(toChildModel)
}

function getChildRecord(response) {
  const child = toChildModel(readRecord(response, "child"))

  if (!child.childId) {
    throw new Error("La respuesta del servidor no contiene un child válido.")
  }

  return child
}

export const childService = {
  // GET /children
  async getChildrenData() {
    const response = await apiClient.get(CHILDREN_ENDPOINT)
    return { children: getChildList(response) }
  },

  // POST /children (exit_date no se acepta al crear; si se indicó, se guarda con PUT)
  async createChild(child) {
    const created = getChildRecord(
      await apiClient.post(CHILDREN_ENDPOINT, toChildPayload(child)),
    )
    if (!child.exitDate) return created
    return this.updateChild(created.childId, { ...child })
  },

  // PUT /children/:id
  async updateChild(childId, changes) {
    return getChildRecord(
      await apiClient.put(
        `${CHILDREN_ENDPOINT}/${childId}`,
        toChildPayload(changes, { includeExitDate: true }),
      ),
    )
  },

  // DELETE /children/:id (soft delete: el backend asigna exit_date)
  async deleteChild(childId) {
    return apiClient.delete(`${CHILDREN_ENDPOINT}/${childId}`)
  },
}
