import { useEffect, useState } from "react"
import { guardianService } from "../services/guardianService"
import { childService } from "../services/childService"
import { childGuardianService } from "../services/childGuardianService"

export function useGuardians() {
  const [guardians, setGuardians] = useState([])
  const [children, setChildren] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadGuardians = async () => {
    setLoading(true)
    setError("")

    try {
      const [guardianData, childData] = await Promise.all([
        guardianService.getGuardianData(),
        childService.getChildrenData(),
      ])
      const linkedGuardians = await Promise.all(
        guardianData.guardians.map(async (guardian) => {
          const childrenIds =
            await childGuardianService.getChildIdsForGuardian(guardian.id)
          return { ...guardian, childrenIds }
        }),
      )
      setGuardians(linkedGuardians)
      setChildren(childData.children)
    } catch (requestError) {
      setError(
        requestError.message || "No fue posible cargar los acudientes.",
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGuardians()
  }, [])

  const createGuardian = async (guardianData) => {
    const guardian = await guardianService.createGuardian(guardianData)
    const childrenIds = guardianData.childrenIds ?? []
    try {
      await childGuardianService.linkGuardianToChildren(
        guardian.id,
        childrenIds,
      )
      setGuardians((current) => [
        ...current,
        { ...guardian, childrenIds },
      ])
      return guardian
    } catch (error) {
      try {
        await guardianService.deleteGuardian(guardian.id)
      } catch (rollbackError) {
        throw new Error(
          `${error.message} No fue posible deshacer la creación del acudiente: ${rollbackError.message}`,
        )
      }
      throw error
    }
  }

  const deleteGuardian = async (id) => {
    try {
      await guardianService.deleteGuardian(id)
      setGuardians((current) =>
        current.filter((guardian) => guardian.id !== id),
      )
      return { ok: true, message: "Acudiente eliminado correctamente." }
    } catch (requestError) {
      return {
        ok: false,
        message:
          requestError.message || "No fue posible eliminar el acudiente.",
      }
    }
  }

  return {
    guardians,
    children,
    loading,
    error,
    loadGuardians,
    createGuardian,
    deleteGuardian,
  }
}
