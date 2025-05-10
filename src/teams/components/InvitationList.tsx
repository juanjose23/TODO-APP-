"use client"
import { useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"
import { Check, X, Calendar, Clock, Eye, Filter, ArrowUpDown } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useInvitationContext } from "../context/InvitationContext"
import { format } from "date-fns"

type InvitationStatus = "pending" | "accepted" | "declined"

interface InvitationListProps {
  onAccept: (token: string) => void
  onReject: (token: string) => void
}

export default function InvitationList({ onAccept, onReject }: InvitationListProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const { invitationList, invitationListLoading, invitationListError } = useInvitationContext()

  const [currentTab, setCurrentTab] = useState(searchParams.get("tab") || "todas")
  const [currentSort, setCurrentSort] = useState(searchParams.get("sort") || "proximas")

  const handleTabChange = (value: string) => {
    setCurrentTab(value)
    const params = new URLSearchParams(location.search)
    params.set("tab", value)
    navigate(`${location.pathname}?${params.toString()}`)
  }

  const handleSortChange = (value: string) => {
    setCurrentSort(value)
    const params = new URLSearchParams(location.search)
    params.set("sort", value)
    navigate(`${location.pathname}?${params.toString()}`)
  }


  // Formatear fecha corta
  const formatShortDate = (date: Date | undefined) => {
    if (!date) return "N/A"
    return format(date, "dd/MM/yyyy")
  }

  if (invitationListLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground font-medium">Cargando invitaciones...</p>
        </div>
      </div>
    )
  }

  if (invitationListError) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center space-y-2 max-w-md mx-auto">
          <div className="bg-destructive/10 text-destructive p-3 rounded-full w-fit mx-auto">
            <X className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold">Error al cargar invitaciones</h3>
          <p className="text-muted-foreground">{invitationListError}</p>
          <Button variant="outline" onClick={() => window.location.reload()} className="mt-2">
            Intentar nuevamente
          </Button>
        </div>
      </div>
    )
  }

  if (!invitationList || invitationList.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center space-y-2 max-w-md mx-auto">
          <div className="bg-muted p-3 rounded-full w-fit mx-auto">
            <Calendar className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No hay invitaciones disponibles</h3>
          <p className="text-muted-foreground">Cuando recibas invitaciones a equipos, aparecerán en esta sección.</p>
        </div>
      </div>
    )
  }

  // Mapeo entre tabs en español y estados en inglés
  const statusMap = {
    pendiente: "pending",
    aceptada: "accepted",
    rechazada: "declined",
  }

  const filteredInvitations = invitationList.filter((invitation) => {
    if (currentTab === "todas") return true
    return invitation.status === statusMap[currentTab as keyof typeof statusMap]
  })

  const sortedInvitations = [...filteredInvitations].sort((a, b) => {
    switch (currentSort) {
      case "proximas":
        return (a.date?.getTime() ?? 0) - (b.date?.getTime() ?? 0)
      case "antiguas":
        return (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0)
      case "recientes":
        return (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0)
      case "menos-recientes":
        return (a.date?.getTime() ?? 0) - (b.date?.getTime() ?? 0)
      default:
        return 0
    }
  })

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Invitaciones</h2>
            <p className="text-muted-foreground mt-1">Gestiona las invitaciones a equipos que has recibido</p>
          </div>

          <div className="flex items-center gap-2 self-end">
            <Select value={currentSort} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[200px]">
                <div className="flex items-center">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Ordenar por" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="proximas">Próximas primero</SelectItem>
                <SelectItem value="antiguas">Antiguas primero</SelectItem>
                <SelectItem value="recientes">Recién creadas</SelectItem>
                <SelectItem value="menos-recientes">Menos recientes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-md mb-6">
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="pendiente">Pendientes</TabsTrigger>
            <TabsTrigger value="aceptada">Aceptadas</TabsTrigger>
            <TabsTrigger value="rechazada">Rechazadas</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-muted-foreground">
            Mostrando <span className="font-medium">{sortedInvitations.length}</span> invitaciones
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Filter className="h-3 w-3" />
              {currentTab === "todas"
                ? "Todas"
                : currentTab === "pendiente"
                  ? "Pendientes"
                  : currentTab === "aceptada"
                    ? "Aceptadas"
                    : "Rechazadas"}
            </Badge>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedInvitations.map((invitation) => (
            <Card key={invitation.token} className="overflow-hidden border transition-all hover:shadow-md">
              <CardHeader className="pb-2 space-y-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-1">{invitation.name}</CardTitle>
                  <StatusBadge status={invitation.status} />
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{formatShortDate(invitation.date)}</span>
                </div>
              </CardHeader>

              <CardContent className="pb-3">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src={invitation.avatar || "/placeholder.svg"} alt={invitation.organizer} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {invitation.organizer.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium line-clamp-1">{invitation.organizer}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">{invitation.email}</p>
                  </div>
                </div>

                <Separator className="my-3" />

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Creada: {formatShortDate(invitation.date)}</span>
                </div>

                {invitation.status !== "pending" && invitation.update && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>
                      {invitation.status === "accepted" ? "Aceptada" : "Rechazada"}:{" "}
                      {formatShortDate(invitation.update)}
                    </span>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex flex-col gap-2 pt-0">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate(`/teams/invite?token=${invitation.token}`)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver detalles
                </Button>

                {invitation.status === "pending" ? (
                  <div className="flex gap-2 w-full">
                    <Button
                      variant="outline"
                      className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => onReject(invitation.token!)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Rechazar
                    </Button>
                    <Button className="flex-1" onClick={() => onAccept(invitation.token!)}>
                      <Check className="h-4 w-4 mr-2" />
                      Aceptar
                    </Button>
                  </div>
                ) : (
                  <div className="text-sm text-center text-muted-foreground py-1">
                    {invitation.status === "accepted" ? (
                      <span className="flex items-center justify-center gap-1.5">
                        <Check className="h-4 w-4 text-green-500" />
                        Invitación aceptada
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-1.5">
                        <X className="h-4 w-4 text-destructive" />
                        Invitación rechazada
                      </span>
                    )}
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: InvitationStatus }) {
  switch (status) {
    case "accepted":
      return (
        <Badge className="bg-green-500 hover:bg-green-600 flex items-center gap-1">
          <Check className="h-3 w-3" />
          Aceptada
        </Badge>
      )
    case "declined":
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <X className="h-3 w-3" />
          Rechazada
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Pendiente
        </Badge>
      )
  }
}
