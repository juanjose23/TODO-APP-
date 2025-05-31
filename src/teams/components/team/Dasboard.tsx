"use client"

import type React from "react"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TeamManagement from "./team-management"
import TaskManagement from "../task-management"
import InvitationManagement from "../Invitation/invitation-management"
import TeamStatistics from "./team-statistics"
import ActivityLog from "./activity-log"
import TaskCalendar from "../task-calendar"
import {Invitation, TeamMember} from "@/teams/types/TeamTypes";

type UserRole = "admin" | "owner" | "member" | "guest";
interface DashboardProps {
  rol: UserRole;
  tittle?: string;
  teamId: string;
  members: TeamMember[];
  invitations: Invitation[];
}

const Dashboard: React.FC<DashboardProps> = ({ rol, tittle, teamId, members, invitations }) => {

  const [activeTab, setActiveTab] = useState("team")

  const canAccess = (tab: string): boolean => {

    const accessMap: Record<string, string[]> = {
      team: ["admin", "owner"],
      tasks: ["admin", "owner", "member"],
      invitations: ["admin", "owner","member"],
      statistics: ["admin", "owner"],
      calendar: ["admin", "owner", "member", "guest"],
      activity: ["admin", "owner", "member", "guest"],
    }
    return accessMap[tab]?.includes(rol) ?? false
  }
  const allTabs = [
    // { value: "team", label: "Equipo", component: <TeamManagement  members={members} /> },
    // { value: "tasks", label: "Tareas", component: <TaskManagement /> },
    { value: "invitations", label: "Invitaciones", component: <InvitationManagement teamId={teamId} /> },
    { value: "statistics", label: "Estadísticas", component: <TeamStatistics /> },
    // { value: "calendar", label: "Calendario", component: <TaskCalendar /> },
    // { value: "activity", label: "Actividad", component: <ActivityLog /> },
  ]


  const availableTabs = allTabs.filter(tab => canAccess(tab.value))
  const currentActiveTab = availableTabs.find(tab => tab.value === activeTab)?.value || availableTabs[0]?.value

  return (
    <div className="p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{tittle}</h1>
      </div>

      <Tabs
        defaultValue={currentActiveTab}
        value={currentActiveTab}
        className="h-[calc(100%-4rem)]"
        onValueChange={setActiveTab}
      >
        <TabsList className={`grid w-full grid-cols-${availableTabs.length} mb-6`}>
          {availableTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {availableTabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="h-full">
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

export default Dashboard
