"use client"

import { Button } from "@/components/ui/button"
import { Users, ChevronRight, Edit, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"
import { generateSlug } from "@/lib/slug";
export function TeamCard({ team, onDeleteClick }: { team: any; onDeleteClick: () => void }) {
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  const teamSlug = generateSlug(team.name, team.id!);

  return (
    <div className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 hover:bg-muted/30 rounded-lg transition-colors gap-4">
      <div className="flex items-center flex-1 w-full">
        <Avatar className="h-10 w-10 mr-4 bg-primary/10 text-primary shrink-0">
          <AvatarFallback>{getInitials(team.name)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-medium truncate">{team.name}</h3>
            {team.role === "Owner" && <Badge variant="outline">{team.role}</Badge>}
          </div>
          <p className="text-sm text-muted-foreground mt-1 truncate max-w-full">{team.description}</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
        <div className="flex items-center text-sm text-muted-foreground sm:mr-4">
          <Users className="h-4 w-4 mr-1" />
          <span>{team.totalUsersCount} members</span>
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
         <Link to={`${teamSlug}`}> 

            <Button variant="ghost" size="sm" className="sm:whitespace-nowrap">
              Ver <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
          {team.role === "Owner" && (
            <div className="flex items-center">
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:bg-destructive/10"
                onClick={onDeleteClick}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
