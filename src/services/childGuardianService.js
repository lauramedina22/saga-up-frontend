import apiClient from "../api/apiClient"

const CHILDREN_ENDPOINT = "/children"
const GUARDIANS_ENDPOINT = "/guardians"

function getIdList(response, collectionKey, idKeys) {
  const records = Array.isArray(response)
    ? response
    : response?.[collectionKey]

  if (!Array.isArray(records)) {
    throw new Error(
      `La respuesta del servidor no contiene una lista de ${collectionKey}.`,
    )
  }

  return records.map((record) => {
    if (typeof record === "string") return record

    const id = idKeys.map((key) => record?.[key]).find(Boolean)
    if (!id) {
      throw new Error(
        "La respuesta del servidor contiene una relación sin identificador.",
      )
    }
    return id
  })
}

export const childGuardianService = {
  async getGuardianIdsForChild(childId) {
    const response = await apiClient.get(
      `${CHILDREN_ENDPOINT}/${childId}/guardians`,
    )
    return getIdList(response, "guardians", ["id", "guardianId"])
  },

  async getChildIdsForGuardian(guardianId) {
    const response = await apiClient.get(
      `${GUARDIANS_ENDPOINT}/${guardianId}/children`,
    )
    return getIdList(response, "children", ["id", "childId"])
  },

  linkChildToGuardian,

  async linkGuardianToChildren(guardianId, childrenIds) {
    const linkedChildIds = []
    for (const childId of childrenIds) {
      try {
        await linkChildToGuardian(childId, guardianId)
        linkedChildIds.push(childId)
      } catch (error) {
        const rollbackErrors = []
        for (const linkedChildId of linkedChildIds) {
          try {
            await unlinkChildFromGuardian(linkedChildId, guardianId)
          } catch (rollbackError) {
            rollbackErrors.push(rollbackError.message)
          }
        }
        if (rollbackErrors.length > 0) {
          throw new Error(
            `${error.message} No se pudieron deshacer algunas relaciones: ${rollbackErrors.join("; ")}`,
          )
        }
        throw error
      }
    }
  },

  unlinkChildFromGuardian,
}

function linkChildToGuardian(childId, guardianId, { primary = false } = {}) {
  return apiClient.post(`${CHILDREN_ENDPOINT}/${childId}/guardians`, {
    guardianId,
    isPrimary: primary,
  })
}

function unlinkChildFromGuardian(childId, guardianId) {
  return apiClient.delete(
    `${CHILDREN_ENDPOINT}/${childId}/guardians/${guardianId}`,
  )
}
