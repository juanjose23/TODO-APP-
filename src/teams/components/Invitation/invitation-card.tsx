"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Trash2, Clock, CheckCircle, XCircle } from "lucide-react"
import {Invitation} from "@/teams/types/TeamTypes.ts"

interface InvitationCardProps {
  invitation: Invitation
  onResend: (email: string) => void
  onRemove: (id: string, email: string) => void
}

const getStatusConfig = (status: Invitation["status"]) => {
  const configs = {
    pending: {
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      text: "Pendiente",
      icon: <Clock className="h-4 w-4 mr-1" />,
      datePrefix: "Enviada el ",
    },
    accepted: {
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      text: "Aceptada",
      icon: <CheckCircle className="h-4 w-4 mr-1" />,
      datePrefix: "Aceptada el ",
    },
    declined: {
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      text: "Rechazada",
      icon: <XCircle className="h-4 w-4 mr-1" />,
      datePrefix: "Rechazada el ",
    },
  }

  return (
    configs[status] || {
      color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      text: status,
      icon: null,
      datePrefix: "",
    }
  )
}

export function InvitationCard({ invitation, onResend, onRemove }: InvitationCardProps) {
  const statusConfig = getStatusConfig(invitation.status)
  const formattedDate = invitation.date?.toISOString().split("T")[0]

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{invitation.email}</CardTitle>
          <Badge className={statusConfig.color}>{statusConfig.text}</Badge>
        </div>
        <CardDescription>Rol: {invitation.roles}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center text-sm text-muted-foreground">
          {statusConfig.icon}
          <span>
            {statusConfig.datePrefix}
            {formattedDate}
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        {invitation.status === "pending" ? (
          <Button variant="outline" size="sm" onClick={() => onResend(invitation.email!)}>
            <Mail className="h-4 w-4 mr-2" />
            Reenviar
          </Button>
        ) : (
          <div />
        )}
        <Button variant="destructive" size="sm" onClick={() => onRemove(invitation.id!, invitation.email!)}>
          <Trash2 className="h-4 w-4 mr-2" />
          Eliminar
        </Button>
      </CardFooter>
    </Card>
  )
}
