import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { TeamServices } from "@/teams/services/TeamServices";
import type { Team } from "@/teams/types/TeamTypes";

export const formSchema = z.object({
    name: z.string().min(1, { message: "El nombre del equipo es obligatorio" }),
    description: z.string().optional(),
    members: z.array(
        z.object({
            value: z.string().min(1, { message: "El miembro debe tener un valor (ID)." }),
            label: z.string(),
            avatar: z.string().nullable().optional(),
            email: z.string().email().optional(),
        })
    )
        .optional(),
});


export type TeamFormValues = z.infer<typeof formSchema>;

interface Option {
    label: string;
    value: string;
    avatar?: string;
    email?: string;
}

export function useTeamFormDialog(
    onCreate?: (team: Team) => void,
    openProp?: boolean,
    onOpenChangeProp?: (open: boolean) => void
) {
    const [internalOpen, setInternalOpen] = useState(false);
    const isOpen = openProp ?? internalOpen;
    const handleOpenChange = onOpenChangeProp ?? setInternalOpen;

    const form = useForm<TeamFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            members: [],
        },
    });

    const currentUser = useSelector((state: RootState) => state.auth.user);
    const [users, setUsers] = useState<Option[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadUsers = async () => {
            if (currentUser) {
                try {
                    const usersList = await TeamServices.GetListUser({ id: currentUser.id });
                    setUsers(usersList);
                } catch (error) {
                    console.error("Error loading users:", error);
                }
            }
        };

        if (isOpen) {
            loadUsers();
        }
    }, [isOpen, currentUser]);

    const onSubmit = async (data: TeamFormValues) => {
        setLoading(true);
        setError(null);

        const payload = {
            id: undefined,
            name: data.name,
            description: data.description ?? undefined,
            members: data.members ?? [],
            userId: currentUser?.id ?? "",
            isActive: true,
        };

        try {
            const createdTeam: Team = await TeamServices.CreateTeam(payload);
            if (onCreate) onCreate(createdTeam);
            form.reset();
            handleOpenChange(false);
        } catch (err: any) {
            setError(err.message || "Error creating team");
            console.error("Error creating team:", err);
        } finally {
            setLoading(false);
        }
    };

    return {
        form,
        users,
        isOpen,
        handleOpenChange,
        onSubmit,
        loading,
        error,
    };
}
