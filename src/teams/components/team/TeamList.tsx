import { motion } from "framer-motion"
import { TeamCard } from "./TeamCard"

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

export function TeamList({
  teams,
  onDelete,
}: {
  teams: any[]
  onDelete: (teamId: string) => void
}) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
    >
      {teams.map((team) => (
        <motion.div key={team.id} variants={item}>
          <TeamCard team={team} onDeleteClick={() => onDelete(team.id)} />
        </motion.div>
      ))}
    </motion.div>
  )
}
