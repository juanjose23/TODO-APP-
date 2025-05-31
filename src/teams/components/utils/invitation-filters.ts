import type { Invitation } from "../../types/TeamTypes";

export function filterInvitations(invitations: Invitation[], searchTerm: string): Invitation[] {
  if (!searchTerm.trim()) return invitations

  const lowercaseSearch = searchTerm.toLowerCase()

  return invitations.filter(
    (invitation) =>
      invitation.email?.toLowerCase().includes(lowercaseSearch) ||
      invitation.roles.toLowerCase().includes(lowercaseSearch),
  )
}
