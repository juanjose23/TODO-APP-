export interface Team {
    id: string | undefined;
    name: string;
    description: string | undefined;
    members: { value: string; label: string }[];
    userId: string | undefined;
    isActive: boolean;
    
}

export interface Invitation {
    name: string;
    email?:string;
    organizer:string;
    description?: string;
    roles: string;
    token?:string|undefined
    date?:Date;
    update?:Date;
    avatar?:string;
    status: "pending" | "accepted" | "declined";
}
