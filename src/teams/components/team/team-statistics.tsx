"use client"

import type React from "react"
import { useState } from "react"
import { useTeam } from "../../context/TeamContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const TeamStatistics: React.FC = () => {
  const { users, tasks } = useTeam()
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month")

  // Estadísticas generales
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === "completed").length
  const pendingTasks = tasks.filter((task) => task.status === "pending").length
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress").length

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Estadísticas por prioridad
  const highPriorityTasks = tasks.filter((task) => task.priority === "high").length
  const mediumPriorityTasks = tasks.filter((task) => task.priority === "medium").length
  const lowPriorityTasks = tasks.filter((task) => task.priority === "low").length

  // Estadísticas por usuario
  const tasksByUser = users
    .map((user) => {
      const userTasks = tasks.filter((task) => task.assignedTo === user.id)
      const completed = userTasks.filter((task) => task.status === "completed").length
      const total = userTasks.length
      const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0

      return {
        id: user.id,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        totalTasks: total,
        completedTasks: completed,
        completionPercentage,
      }
    })
    .sort((a, b) => b.totalTasks - a.totalTasks)

  // Estadísticas por etiquetas
  const tagCounts: Record<string, number> = {}
  tasks.forEach((task) => {
    task.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })

  const tagStats = Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5) // Top 5 etiquetas

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Estadísticas del Equipo</h2>
        <Select value={timeRange} onValueChange={(value: "week" | "month" | "year") => setTimeRange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Seleccionar período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Última semana</SelectItem>
            <SelectItem value="month">Último mes</SelectItem>
            <SelectItem value="year">Último año</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Tareas</CardTitle>
            <CardDescription>Todas las tareas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {timeRange === "week" ? "Esta semana" : timeRange === "month" ? "Este mes" : "Este año"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tareas Completadas</CardTitle>
            <CardDescription>Progreso del equipo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
            <div className="w-full bg-secondary mt-2 rounded-full h-2.5">
              <div className="bg-primary h-2.5 rounded-full" style={{ width: `${completionRate}%` }}></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{completionRate}% completado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tareas Pendientes</CardTitle>
            <CardDescription>Por hacer</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((pendingTasks / totalTasks) * 100) || 0}% del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
            <CardDescription>Tareas activas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressTasks}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((inProgressTasks / totalTasks) * 100) || 0}% del total
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="members">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="members">Miembros</TabsTrigger>
          <TabsTrigger value="priorities">Prioridades</TabsTrigger>
          <TabsTrigger value="tags">Etiquetas</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento por Miembro</CardTitle>
              <CardDescription>Tareas asignadas y completadas por cada miembro del equipo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {tasksByUser.map((user) => (
                  <div key={user.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {user.completedTasks}/{user.totalTasks}
                        </p>
                        <p className="text-xs text-muted-foreground">{user.completionPercentage}% completado</p>
                      </div>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: `${user.completionPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="priorities" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribución por Prioridad</CardTitle>
              <CardDescription>Cantidad de tareas según su nivel de prioridad</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400">{highPriorityTasks}</div>
                  <p className="text-sm font-medium mt-1">Alta</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round((highPriorityTasks / totalTasks) * 100) || 0}% del total
                  </p>
                </div>

                <div className="flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{mediumPriorityTasks}</div>
                  <p className="text-sm font-medium mt-1">Media</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round((mediumPriorityTasks / totalTasks) * 100) || 0}% del total
                  </p>
                </div>

                <div className="flex flex-col items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">{lowPriorityTasks}</div>
                  <p className="text-sm font-medium mt-1">Baja</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round((lowPriorityTasks / totalTasks) * 100) || 0}% del total
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tags" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Etiquetas Más Utilizadas</CardTitle>
              <CardDescription>Las 5 etiquetas más frecuentes en las tareas</CardDescription>
            </CardHeader>
            <CardContent>
              {tagStats.length > 0 ? (
                <div className="space-y-4">
                  {tagStats.map(({ tag, count }) => (
                    <div key={tag} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium">{tag}</p>
                        <p className="text-sm">{count} tareas</p>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{ width: `${(count / totalTasks) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">No hay etiquetas disponibles</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default TeamStatistics
