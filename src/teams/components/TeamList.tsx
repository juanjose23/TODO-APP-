import { TeamCard } from "./TeamCard"

export function TeamList({ teams, onDelete }: { teams: any[]; onDelete: (teamId: string) => void }) {
  return (
    <div className="space-y-3">
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} onDeleteClick={() => onDelete(team.id)} />
      ))}
    </div>
  )
}
