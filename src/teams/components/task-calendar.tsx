"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useTeam, type Task } from "../context/TeamContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const TaskCalendar: React.FC = () => {
  const { tasks, users } = useTeam()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarDays, setCalendarDays] = useState<Date[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string>("all")

  // Generar días del calendario para el mes actual
  useEffect(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    // Primer día del mes
    const firstDay = new Date(year, month, 1)
    // Último día del mes
    const lastDay = new Date(year, month + 1, 0)

    // Día de la semana del primer día (0 = Domingo, 1 = Lunes, etc.)
    let firstDayOfWeek = firstDay.getDay()
    // Ajustar para que la semana comience en lunes (0 = Lunes, 6 = Domingo)
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1

    // Calcular el primer día a mostrar (puede ser del mes anterior)
    const start = new Date(firstDay)
    start.setDate(start.getDate() - firstDayOfWeek)

    // Generar 42 días (6 semanas) para asegurar que se cubra todo el mes
    const days: Date[] = []
    for (let i = 0; i < 42; i++) {
      const day = new Date(start)
      day.setDate(day.getDate() + i)
      days.push(day)
    }

    setCalendarDays(days)
  }, [currentDate])

  // Filtrar tareas por usuario seleccionado
  const filteredTasks = selectedUserId === "all" ? tasks : tasks.filter((task) => task.assignedTo === selectedUserId)

  // Obtener tareas para una fecha específica
  const getTasksForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    return filteredTasks.filter((task) => task.dueDate === dateString)
  }

  // Cambiar al mes anterior
  const prevMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() - 1)
      return newDate
    })
  }

  // Cambiar al mes siguiente
  const nextMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + 1)
      return newDate
    })
  }

  // Cambiar al mes actual
  const currentMonth = () => {
    setCurrentDate(new Date())
  }

  // Formatear nombre del mes
  const formatMonth = (date: Date) => {
    return date.toLocaleString("es-ES", { month: "long", year: "numeric" })
  }

  // Verificar si una fecha es hoy
  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  // Verificar si una fecha es del mes actual
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth()
  }

  // Obtener color según el estado de la tarea
  const getTaskStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Calendario de Tareas</h2>
        <div className="flex items-center space-x-2">
          <Select value={selectedUserId} onValueChange={setSelectedUserId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar por miembro" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los miembros</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>{formatMonth(currentDate)}</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={currentMonth}>
                Hoy
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day, index) => (
              <div key={index} className="text-center py-2 font-medium text-sm">
                {day}
              </div>
            ))}
          </div>

          {/* Días del calendario */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const dayTasks = getTasksForDate(day)
              return (
                <div
                  key={index}
                  className={`min-h-[100px] p-1 border rounded-md ${
                    isToday(day)
                      ? "bg-primary/10 border-primary"
                      : isCurrentMonth(day)
                        ? "bg-card"
                        : "bg-muted/30 text-muted-foreground"
                  }`}
                >
                  <div className="text-right text-sm p-1">{day.getDate()}</div>
                  <div className="space-y-1 max-h-[80px] overflow-y-auto">
                    {dayTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`text-xs p-1 rounded truncate border ${getTaskStatusColor(task.status)}`}
                        title={task.title}
                      >
                        {task.title}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Leyenda */}
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <span className="text-sm">Pendiente</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-400"></div>
          <span className="text-sm">En Progreso</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
          <span className="text-sm">Completada</span>
        </div>
      </div>
    </div>
  )
}

export default TaskCalendar
