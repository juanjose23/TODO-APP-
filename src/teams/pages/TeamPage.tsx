"use client"

import { useEffect, useState } from "react"
import type { Team } from "@/teams/types/TeamTypes"
import { TeamServices } from "@/teams/services/TeamServices"
import { DeleteTeamDialog } from "@/teams/components/DeleteTeamDialog"
import TeamFormDialog from "@/teams/components/TeamFormDialog"
import { TeamSearch } from "@/teams/components/TeamSearch"
import { PlusCircle, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { TeamList } from "../components/TeamList"

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTeams = async () => {
      setIsLoading(true)
      try {
        const data = await TeamServices.getUserTeams()
        setTeams(data)
        setFilteredTeams(data)
      } catch (error) {
        console.error("Error al obtener equipos:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeams()
  }, [])

  useEffect(() => {
    const filtered = teams.filter((team) => team.name.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredTeams(filtered)
  }, [searchTerm, teams])

  const handleDeleteTeam = async () => {
    if (!teamToDelete) return
    try {
      // await TeamServices.deleteTeam(teamToDelete.id);
      setTeams((prev) => prev.filter((t) => t.id !== teamToDelete.id))
      setTeamToDelete(null)
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Error al eliminar equipo:", error)
    }
  }

  const handleCreateTeam = (team: Team) => {
    setTeams((prev) => [...prev, team]);
    setIsCreateDialogOpen(false);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
      <div className="container mx-auto py-12 px-4 max-w-7xl">
        {/* Hero section */}
        <div className="mb-12 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Mis equipos</h1>
              <p className="mt-2 text-muted-foreground max-w-2xl">
                Gestiona tus equipos, colabora con otros miembros y organiza tus proyectos de manera eficiente.
              </p>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)} size="lg" className="group">
              <PlusCircle className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
              Crear nuevo equipo
            </Button>
          </div>
        </div>

        {/* Search and filters */}
        <div className="bg-card rounded-lg shadow-sm p-4 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-96">
              <TeamSearch value={searchTerm} onChange={setSearchTerm} />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>
                {filteredTeams.length} {filteredTeams.length === 1 ? "equipo" : "equipos"}
              </span>
            </div>
          </div>
        </div>

        {/* Teams grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredTeams.length > 0 ? (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredTeams.map((team) => (
              <motion.div key={team.id} variants={item}>
                 <TeamList teams={teams} onDelete={() => {}} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-muted/50 rounded-full p-6 mb-4">
              <Users className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">No se encontraron equipos</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              {searchTerm
                ? `No hay equipos que coincidan con "${searchTerm}". Intenta con otra búsqueda.`
                : "Aún no tienes equipos. Crea tu primer equipo para comenzar a colaborar."}
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Crear nuevo equipo
            </Button>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <DeleteTeamDialog
        teamName={teamToDelete?.name || ""}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteTeam}
      />

      <TeamFormDialog
      
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreate={handleCreateTeam}
      />
    </div>
  )
}
