"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface InvitationSearchProps {
  searchTerm: string
  onSearchChange: (value: string) => void
}

export function InvitationSearch({ searchTerm, onSearchChange }: InvitationSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Buscar invitaciones..."
        className="pl-10"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  )
}
