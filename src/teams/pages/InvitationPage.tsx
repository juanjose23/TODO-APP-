"use client"

import { useInvitationTeam } from "@/teams/hooks/useInvitationTeam"
import { useState, useEffect } from "react"
import { Check, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useNavigate } from "react-router-dom";

type InvitationStatus = "pending" | "accepted" | "declined"

export default function InvitationPage() {
    const { invitation,error,loading } = useInvitationTeam(); 
    const navigate = useNavigate();
    const [status, setStatus] = useState<InvitationStatus>("pending");
    

    useEffect(() => {
        if (error) {
            navigate("/notfound");
        }
    }, [error, navigate]);

    if (loading) {
        return <p className="text-center py-10 text-muted-foreground">Cargando invitación...</p>;
    }

    if (!invitation) {
        return null; // Prevent rendering if redirection is happening
    }

    const acceptInvitation = () => {
        setStatus("accepted");
    }

    const rejectInvitation = () => {
        setStatus("declined");
    }

    const resetInvitation = () => {
        setStatus("pending");
    }


    return (
        <div className="max-w-xl mx-auto">
            <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{invitation.name}</CardTitle>
                        <StatusBadge status={status} />
                    </div>
                    <CardDescription>Fecha: {invitation.date?.toISOString().split("T")[0]}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                    <div className="flex items-center gap-3 mb-2">
                        <Avatar>
                            <AvatarImage src={invitation.avatar || "/placeholder.svg"} alt={invitation.name} />
                            <AvatarFallback>  {invitation.name ? invitation.name.substring(0, 2).toUpperCase() : "??"}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">{invitation.organizer}</p>
                            <p className="text-sm text-muted-foreground">{invitation.email}</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="pt-2">
                    {status === "pending" ? (
                        <div className="flex gap-2 w-full">
                            <Button
                                variant="outline"
                                className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                onClick={rejectInvitation}
                            >
                                <X className="h-4 w-4 mr-2" />
                                Rechazar
                            </Button>
                            <Button className="flex-1" onClick={acceptInvitation}>
                                <Check className="h-4 w-4 mr-2" />
                                Aceptar
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
