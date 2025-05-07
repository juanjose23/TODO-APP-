export interface Team {
    id: string | undefined;
    name: string;
    description: string | undefined;
    members: { value: string; label: string }[]; 
    userId: string | undefined;
    isActive: boolean;
}
