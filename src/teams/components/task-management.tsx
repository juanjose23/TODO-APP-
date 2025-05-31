"use client"

import type React from "react"
import { useState } from "react"
import { useTeam, type Task } from "../context/TeamContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, PlusCircle, Trash2, Calendar, Tag, MessageSquare, Download, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
const TaskManagement: React.FC = () => {
  const { tasks, users, addTask, updateTask, removeTask, addComment, filterTasks, exportData } = useTeam()

  const [searchTerm, setSearchTerm] = useState("")
  const [newTask, setNewTask] = useState<Omit<Task, "id" | "comments" | "createdAt" | "updatedAt">>({
    title: "",
    description: "",
    status: "pending",
    assignedTo: "",
    dueDate: "",
    priority: "medium",
    tags: [],
  })
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [newTagInput, setNewTagInput] = useState("")
  const [commentText, setCommentText] = useState("")
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const [filters, setFilters] = useState<{
    status: Task["status"][]
    priority: Task["priority"][]
    assignedTo: string[]
    tags: string[]
    dueDate: { from: string; to: string }
  }>({
    status: [],
    priority: [],
    assignedTo: [],
    tags: [],
    dueDate: { from: "", to: "" },
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Obtener todas las etiquetas únicas
  const allTags = Array.from(new Set(tasks.flatMap((task) => task.tags)))

  // Aplicar filtros y búsqueda
  const filteredTasks = filterTasks({
    status: filters.status.length > 0 ? filters.status : undefined,
    priority: filters.priority.length > 0 ? filters.priority : undefined,
    assignedTo: filters.assignedTo.length > 0 ? filters.assignedTo : undefined,
    tags: filters.tags.length > 0 ? filters.tags : undefined,
    dueDate:
      filters.dueDate.from || filters.dueDate.to ? { from: filters.dueDate.from, to: filters.dueDate.to } : undefined,
  }).filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      users
        .find((user) => user.id === task.assignedTo)
        ?.name.toLowerCase()
        .includes(searchTerm.toLowerCase()),
  )
const handleAddTask = () => {
  if (!newTask.title || !newTask.assignedTo || !newTask.dueDate) {
    toast("Campos requeridos faltantes", {
      description: "Completa todos los campos obligatorios antes de agregar la tarea.",
    });
    return;
  }

  addTask(newTask);
  setNewTask({
    title: "",
    description: "",
    status: "pending",
    assignedTo: "",
    dueDate: "",
    priority: "medium",
    tags: [],
  });
  setIsAddTaskOpen(false);

  toast("Tarea agregada", {
    description: `La tarea "${newTask.title}" ha sido agregada.`,
  });
};

const handleRemoveTask = (id: string, title: string) => {
  removeTask(id);
  toast("Tarea eliminada", {
    description: `La tarea "${title}" ha sido eliminada.`,
  });
};

const handleStatusChange = (id: string, status: Task["status"]) => {
  updateTask(id, { status });
  toast("Estado actualizado", {
    description: `La tarea ahora está en estado "${status}".`,
  });
};

const handleAddTag = () => {
  const trimmedTag = newTagInput.trim();
  if (trimmedTag && !newTask.tags.includes(trimmedTag)) {
    setNewTask({
      ...newTask,
      tags: [...newTask.tags, trimmedTag],
    });
    setNewTagInput("");
  }
};

const handleRemoveTag = (tag: string) => {
  setNewTask({
    ...newTask,
    tags: newTask.tags.filter((t) => t !== tag),
  });
};

const handleAddComment = (taskId: string) => {
  if (commentText.trim()) {
    addComment(taskId, "1", commentText); // Suponiendo userId = 1
    setCommentText("");
    toast(
       "Comentario agregado",{
      description: "Tu comentario ha sido agregado a la tarea.",
    });
  }
};

  const handleExportTasks = () => {
    const csvContent = exportData("tasks")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "tareas.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast(
     "Exportación completada",{
      description: "Las tareas han sido exportadas en formato CSV",
    })
  }

  const toggleFilter = (type: keyof typeof filters, value: any) => {
    if (type === "dueDate") {
      setFilters({
        ...filters,
        dueDate: value,
      })
    } else {
      const currentValues = filters[type]
      const exists = currentValues.includes(value)

      setFilters({
        ...filters,
        [type]: exists ? currentValues.filter((v) => v !== value) : [...currentValues, value],
      })
    }
  }

  const clearFilters = () => {
    setFilters({
      status: [],
      priority: [],
      assignedTo: [],
      tags: [],
      dueDate: { from: "", to: "" },
    })
  }

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "medium":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getStatusText = (status: Task["status"]) => {
    switch (status) {
      case "pending":
        return "Pendiente"
      case "in-progress":
        return "En Progreso"
      case "completed":
        return "Completada"
      default:
        return status
    }
  }

  const getPriorityText = (priority: Task["priority"]) => {
    switch (priority) {
      case "low":
        return "Baja"
      case "medium":
        return "Media"
      case "high":
        return "Alta"
      default:
        return priority
    }
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("es-ES", options)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Tareas</h2>
        <div className="flex space-x-2">
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtros
                {(filters.status.length > 0 ||
                  filters.priority.length > 0 ||
                  filters.assignedTo.length > 0 ||
                  filters.tags.length > 0 ||
                  filters.dueDate.from ||
                  filters.dueDate.to) && (
                  <Badge className="ml-2 bg-primary" variant="default">
                    {filters.status.length +
                      filters.priority.length +
                      filters.assignedTo.length +
                      filters.tags.length +
                      (filters.dueDate.from ? 1 : 0) +
                      (filters.dueDate.to ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Filtrar tareas</h4>
                <Separator />

                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Estado</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {["pending", "in-progress", "completed"].map((status) => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox
                          id={`status-${status}`}
                          checked={filters.status.includes(status as Task["status"])}
                          onCheckedChange={() => toggleFilter("status", status)}
                        />
                        <label htmlFor={`status-${status}`} className="text-sm">
                          {getStatusText(status as Task["status"])}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Prioridad</h5>
                  <div className="grid grid-cols-3 gap-2">
                    {["low", "medium", "high"].map((priority) => (
                      <div key={priority} className="flex items-center space-x-2">
                        <Checkbox
                          id={`priority-${priority}`}
                          checked={filters.priority.includes(priority as Task["priority"])}
                          onCheckedChange={() => toggleFilter("priority", priority)}
                        />
                        <label htmlFor={`priority-${priority}`} className="text-sm">
                          {getPriorityText(priority as Task["priority"])}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Asignado a</h5>
                  <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`user-${user.id}`}
                          checked={filters.assignedTo.includes(user.id)}
                          onCheckedChange={() => toggleFilter("assignedTo", user.id)}
                        />
                        <label htmlFor={`user-${user.id}`} className="text-sm">
                          {user.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {allTags.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Etiquetas</h5>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                      {allTags.map((tag) => (
                        <div key={tag} className="flex items-center space-x-2">
                          <Checkbox
                            id={`tag-${tag}`}
                            checked={filters.tags.includes(tag)}
                            onCheckedChange={() => toggleFilter("tags", tag)}
                          />
                          <label htmlFor={`tag-${tag}`} className="text-sm">
                            {tag}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Fecha límite</h5>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label htmlFor="date-from" className="text-xs">
                        Desde
                      </label>
                      <Input
                        id="date-from"
                        type="date"
                        value={filters.dueDate.from}
                        onChange={(e) => toggleFilter("dueDate", { ...filters.dueDate, from: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="date-to" className="text-xs">
                        Hasta
                      </label>
                      <Input
                        id="date-to"
                        type="date"
                        value={filters.dueDate.to}
                        onChange={(e) => toggleFilter("dueDate", { ...filters.dueDate, to: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Limpiar filtros
                  </Button>
                  <Button size="sm" onClick={() => setIsFilterOpen(false)}>
                    Aplicar
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button variant="outline" onClick={handleExportTasks}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>

          <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Agregar Tarea
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Agregar Nueva Tarea</DialogTitle>
                <DialogDescription>Completa la información para agregar una nueva tarea.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Título
                  </Label>
                  <Input
                    id="title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Descripción
                  </Label>
                  <Textarea
                    id="description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="assignedTo" className="text-right">
                    Asignar a
                  </Label>
                  <Select
                    onValueChange={(value) => setNewTask({ ...newTask, assignedTo: value })}
                    value={newTask.assignedTo}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccionar miembro" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Estado
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setNewTask({
                        ...newTask,
                        status: value as Task["status"],
                      })
                    }
                    value={newTask.status}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="in-progress">En Progreso</SelectItem>
                      <SelectItem value="completed">Completada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="priority" className="text-right">
                    Prioridad
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setNewTask({
                        ...newTask,
                        priority: value as Task["priority"],
                      })
                    }
                    value={newTask.priority}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccionar prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baja</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dueDate" className="text-right">
                    Fecha límite
                  </Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="tags" className="text-right pt-2">
                    Etiquetas
                  </Label>
                  <div className="col-span-3 space-y-2">
                    <div className="flex space-x-2">
                      <Input
                        id="tags"
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        placeholder="Agregar etiqueta"
                      />
                      <Button type="button" onClick={handleAddTag} size="sm">
                        Agregar
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {newTask.tags.map((tag) => (
                        <Badge key={tag} className="flex items-center gap-1 px-3 py-1">
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="text-xs rounded-full hover:bg-primary/20 w-4 h-4 inline-flex items-center justify-center"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddTaskOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddTask}>Agregar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar tareas..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task) => {
          const assignedUser = users.find((user) => user.id === task.assignedTo)
          return (
            <Card key={task.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="mr-2">{task.title}</CardTitle>
                  <div className="flex flex-col gap-1 items-end">
                    <Badge className={getStatusColor(task.status)}>{getStatusText(task.status)}</Badge>
                    <Badge className={getPriorityColor(task.priority)}>{getPriorityText(task.priority)}</Badge>
                  </div>
                </div>
                <CardDescription>
                  <div className="flex items-center mt-1">
                    {assignedUser && (
                      <div className="flex items-center">
                        <Avatar className="h-5 w-5 mr-1">
                          <AvatarImage src={assignedUser.avatar || "/placeholder.svg"} alt={assignedUser.name} />
                          <AvatarFallback className="text-xs">{assignedUser.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{assignedUser.name}</span>
                      </div>
                    )}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{task.description}</p>

                {task.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {task.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center mt-4 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  Fecha límite: {formatDate(task.dueDate)}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="flex justify-between w-full">
                  <Select
                    value={task.status}
                    onValueChange={(value) => handleStatusChange(task.id, value as Task["status"])}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Cambiar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="in-progress">En Progreso</SelectItem>
                      <SelectItem value="completed">Completada</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="destructive" size="sm" onClick={() => handleRemoveTask(task.id, task.title)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="comments">
                    <AccordionTrigger className="py-2">
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Comentarios ({task.comments.length})
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        {task.comments.length > 0 ? (
                          <div className="space-y-3 max-h-40 overflow-y-auto">
                            {task.comments.map((comment) => {
                              const commentUser = users.find((u) => u.id === comment.userId)
                              return (
                                <div key={comment.id} className="bg-muted p-3 rounded-md">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <Avatar className="h-6 w-6">
                                      <AvatarImage
                                        src={commentUser?.avatar || "/placeholder.svg"}
                                        alt={commentUser?.name}
                                      />
                                      <AvatarFallback className="text-xs">
                                        {commentUser?.name.charAt(0) || "U"}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="text-sm font-medium">{commentUser?.name || "Usuario"}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {new Date(comment.createdAt).toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                  <p className="text-sm">{comment.text}</p>
                                </div>
                              )
                            })}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No hay comentarios aún</p>
                        )}

                        <div className="flex space-x-2">
                          <Input
                            placeholder="Agregar un comentario..."
                            value={activeTaskId === task.id ? commentText : ""}
                            onChange={(e) => {
                              setActiveTaskId(task.id)
                              setCommentText(e.target.value)
                            }}
                            onFocus={() => setActiveTaskId(task.id)}
                          />
                          <Button size="sm" onClick={() => handleAddComment(task.id)}>
                            Enviar
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No se encontraron tareas</p>
        </div>
      )}
    </div>
  )
}

export default TaskManagement
