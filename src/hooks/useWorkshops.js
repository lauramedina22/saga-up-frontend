import { useCallback, useEffect, useState } from "react"
import { staffWorkshopService } from "../services/staffWorkshopService.js"

export function useWorkshops() {
  const [staffList, setStaffList] = useState([])
  const [workshops, setWorkshops] = useState([])
  const [schedules, setSchedules] = useState([])
  const [shifts, setShifts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadAllData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const [staffData, workshopsData, schedulesData, shiftsData] =
        await Promise.all([
          staffWorkshopService.getStaff(),
          staffWorkshopService.getWorkshops(),
          staffWorkshopService.getSchedules(),
          staffWorkshopService.getStaffAssistance(),
        ])
      setStaffList(staffData)
      setWorkshops(workshopsData)
      setSchedules(schedulesData)
      setShifts(shiftsData)
    } catch (err) {
      setError(err?.message || "Error al cargar la información de talleres y personal.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAllData()
  }, [loadAllData])

  const createWorkshop = async (workshopData) => {
    const created = await staffWorkshopService.createWorkshop(workshopData)
    setWorkshops((prev) => [created, ...prev])
    return created
  }

  const createSchedule = async (scheduleData) => {
    const created = await staffWorkshopService.createSchedule(scheduleData)
    setSchedules((prev) => [created, ...prev])
    return created
  }

  const recordShift = async (shiftData) => {
    const created = await staffWorkshopService.recordStaffShift(shiftData)
    setShifts((prev) => [created, ...prev])
    return created
  }

  const createStaff = async (staffData, extraData) => {
    const created = await staffWorkshopService.createStaff(staffData, extraData)
    setStaffList((prev) => [created, ...prev])
    return created
  }

  return {
    staffList,
    workshops,
    schedules,
    shifts,
    loading,
    error,
    reload: loadAllData,
    createWorkshop,
    createSchedule,
    recordShift,
    createStaff,
  }
}
