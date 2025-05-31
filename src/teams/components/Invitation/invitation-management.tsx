"use client"

import { useState, useEffect } from "react"
import { useInvitationContext } from "@/teams/context/InvitationContext"
import { useTeamFormDialog } from "../../hooks/useTeamFormDialog"
import { filterInvitations } from "../utils/invitation-filters"
import { InvitationDialog } from "./invitation-dialog"
import { InvitationSearch } from "./invitation-search"
import { InvitationCard } from "./invitation-card"
import { toast } from "sonner"
interface InvitationManagementProps {
  teamId: number
}

export default function InvitationManagement({ teamId }: InvitationManagementProps) {
  const { invitationListTeam } = useInvitationContext()
  console.log(invitationListTeam, "invitationListTeam")
  const { users, isOpen, formDetails, onSubmitInvitation, handleOpenChange } = useTeamFormDialog(undefined,undefined,undefined,teamId)
  const handleRemoveInvitation = (id: string, email: string) => {
    
    toast("Invitación eliminada", {
      description: `La invitación a ${email} ha sido eliminada`,
    })
  }

  const handleResendInvitation = (email: string) => {
    toast("Invitación reenviada", {
      description: `Se ha reenviado la invitación a ${email}`,
    })
  }

  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (teamId) {
      formDetails.setValue("teamId", teamId)
    }
  }, [teamId, formDetails])

  const filteredInvitations = filterInvitations(invitationListTeam ?? [], searchTerm)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Invitaciones</h2>
        <InvitationDialog
          isOpen={isOpen}
          onOpenChange={handleOpenChange}
          formDetails={formDetails}
          onSubmitInvitation={onSubmitInvitation}
          users={users}
          teamId={teamId}
        />
      </div>

      <InvitationSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInvitations.map((invitation, index) => (
          <InvitationCard
            key={invitation.id ?? invitation.email ?? index}
            invitation={invitation}
            onResend={handleResendInvitation}
            onRemove={handleRemoveInvitation}
          />
        ))}
      </div>

      {filteredInvitations.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No se encontraron invitaciones</p>
        </div>
      )}
    </div>
  )
}
