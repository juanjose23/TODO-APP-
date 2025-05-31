export interface Team {
  id?: string ;
  name: string;
  description?: string;
  members: { value: string; label: string }[];
  userId?: string;
  isActive: boolean;
}

export interface Invitation {
  id?: string;
  name: string;
  email?: string;
  organizer?: string;
  description?: string;
  roles: string;
  token?: string;
  date?: Date;
  update?: Date;
  avatar?: string;
  status: "pending" | "accepted" | "declined";
}

export interface TeamMember {
  memberId: string;     
  name: string;     
  roles?: string[] | null; 
}

export interface Task {
  title: string;
  description: string;
}

export interface TeamDetails extends Omit<Team, 'members'> {
  members: TeamMember[];
  invitations: Invitation[];
  currentUserRoles?: string;
}
 


export interface ActivityEvent {
  id: string
  userId: string
  action: string
  targetType: "user" | "task" | "invitation"
  targetId: string
  details: string
  timestamp: string
}