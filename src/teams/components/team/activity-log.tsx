"use client"

import type React from "react"
import { useState } from "react"
import { useTeam, type ActivityEvent } from "../context/TeamContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Trash2, Clock, User, FileText, Mail } from "lucide-react"
import {toast} from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const ActivityLog: React.FC = () => {
  const { activityLog, users, tasks, clearActivityLog, exportData } = useTeam()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "user" | "task" | "invitation">("all")
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")

  // Filtrar y ordenar actividades
  const filteredActivities = activityLog
    .filter((activity) => {
      // Filtrar por tipo
      if (filterType !== "all" && activity.targetType !== filterType) {
        return false
      }

      // Filtrar por término de búsqueda
      if (searchTerm) {
        const user = users.find((u) => u.id === activity.userId)
        const lowerSearchTerm = searchTerm.toLowerCase()

        return (
          activity.details.toLowerCase().includes(lowerSearchTerm) ||
          (user && user.name.toLowerCase().includes(lowerSearchTerm))
        )
      }

      return true
    })
    .sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime()
      const dateB = new Date(b.timestamp).getTime()
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB
    })

  const handleExportActivity = () => {
    const csvContent = exportData("activity")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "actividad.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast( "Exportación completada",{
      description: "El registro de actividad ha sido exportado en formato CSV",
    })
  }

  const handleClearActivity = () => {
    if (
      confirm("¿Estás seguro de que deseas borrar todo el historial de actividad? Esta acción no se puede deshacer.")
    ) {
      clearActivityLog()
      toast( "Historial borrado",{
        description: "El registro de actividad ha sido borrado completamente",
      })
    }
  }

  const getActivityIcon = (activity: ActivityEvent) => {
    switch (activity.targetType) {
      case "user":
        return <User className="h-4 w-4" />
      case "task":
        return <FileText className="h-4 w-4" />
      case "invitation":
        return <Mail className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getActivityColor = (activity: ActivityEvent) => {
    switch (activity.action) {
      case "added":
      case "created":
      case "completed":
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "updated":
      case "commented":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "removed":
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "invited":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Registro de Actividad</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportActivity}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button variant="destructive" onClick={handleClearActivity}>
            <Trash2 className="mr-2 h-4 w-4" />
            Borrar Historial
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar actividades..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select
            value={filterType}
            onValueChange={(value: "all" | "user" | "task" | "invitation") => setFilterType(value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="user">Usuarios</SelectItem>
              <SelectItem value="task">Tareas</SelectItem>
              <SelectItem value="invitation">Invitaciones</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={(value: "newest" | "oldest") => setSortOrder(value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Más recientes</SelectItem>
              <SelectItem value="oldest">Más antiguos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => {
            const user = users.find((u) => u.id === activity.userId)
            return (
              <Card key={activity.id}>
                <CardHeader className="py-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                        <AvatarFallback>{user?.name.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{user?.name || "Usuario"}</CardTitle>
                        <CardDescription>{formatDate(activity.timestamp)}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getActivityColor(activity)}>
                      <div className="flex items-center space-x-1">
                        {getActivityIcon(activity)}
                        <span className="capitalize">{activity.action}</span>
                      </div>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="py-0">
                  <p>{activity.details}</p>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No se encontraron actividades</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ActivityLog
