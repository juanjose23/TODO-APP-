"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Mail, Clock, Check, X } from "lucide-react"
import { toast } from "sonner"
import { useInvitationTeam } from "@/teams/hooks/useInvitationTeam"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

type InvitationStatus = "pending" | "accepted" | "declined"

export default function InvitationDetailPage() {
  const { invitation, invitationError, invitationLoading } = useInvitationTeam()
  const navigate = useNavigate()


  const [status, setStatus] = useState<InvitationStatus>("pending")

  useEffect(() => {
    if (invitation?.status) {
      setStatus(invitation.status as InvitationStatus)
    }
  }, [invitation])

  useEffect(() => {
    if (invitationError) {
      navigate("/notfound")
    }
  }, [invitationError, navigate])

  const acceptInvitation = () => {
    setStatus("accepted")
    toast.success("Invitación aceptada",{
       
      description: `Has aceptado la invitación para "${invitation?.name}"`,
    })
  }

  const rejectInvitation = () => {
    setStatus("declined")
    toast.error("Invitación rechazada", {

      description: `Has rechazado la invitación para "${invitation?.name}"`,

    })
  }

  const resetInvitation = () => {
    setStatus("pending")
    toast("Invitación restablecida", {

      description: `La invitación para "${invitation?.name}" ha sido restablecida a pendiente`,
    })
  }

  if (invitationLoading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Button variant="outline" className="mb-6" onClick={() => navigate("/teams/invite/list")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a la lista
        </Button>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!invitation) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Button variant="outline" className="mb-6" onClick={() => navigate("/teams/invite/list")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a la lista
        </Button>
        <p className="text-center py-10 text-muted-foreground">Invitación no encontrada.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">

      <Button variant="outline" className="mb-6" onClick={() => navigate("/teams/invite/list")}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver a la lista
      </Button>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl">{invitation.name}</CardTitle>
                <StatusBadge status={status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Creada</p>
                    <p className="text-muted-foreground">
                      {invitation.date?.toISOString().split("T")[0]}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Descripción</h3>
                <p className="text-muted-foreground">{invitation.description}</p>
              </div>
            </CardContent>
            <CardFooter>
              {status === "pending" ? (
                <div className="flex gap-3 w-full">
                  <Button
                    variant="outline"
                    className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={rejectInvitation}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Rechazar invitación
                  </Button>
                  <Button className="flex-1" onClick={acceptInvitation}>
                    <Check className="h-4 w-4 mr-2" />
                    Aceptar invitación
                  </Button>
                </div>
              ) : (
                <Button variant="outline" className="w-full" onClick={resetInvitation}>
                  Restablecer a pendiente
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Información del invitado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={invitation.avatar || "/placeholder.svg"} alt={invitation.name} />
                  <AvatarFallback className="text-lg">{invitation.organizer.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{invitation.organizer}</h3>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">{invitation.email}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Historial de cambios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Invitación creada</span>
                  <span className="text-muted-foreground">{invitation.date?.toISOString().split("T")[0]}</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <p className="text-sm text-muted-foreground">
                    Estado actual: <StatusBadge status={invitation.status} />
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  )
}

function StatusBadge({ status }: { status: InvitationStatus }) {
  switch (status) {
    case "accepted":
      return <Badge className="bg-green-500 hover:bg-green-600">Aceptada</Badge>
    case "declined":
      return <Badge variant="destructive">Rechazada</Badge>
    default:
      return <Badge variant="outline">Pendiente</Badge>
  }
}
