import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { RootState } from "@/lib/store/store";
import { TeamServices } from "@/teams/services/TeamServices";
import type { Team } from "@/teams/types/TeamTypes";
import { generateSlug } from "@/lib/slug";



const memberSchema = z.object({
  value: z.string().min(1, { message: "El miembro debe tener un valor" }),
  label: z.string(),
  avatar: z.string().nullable().optional(),
  email: z.string().email().optional(),
});

const memberWithRoleSchema = z.object({
  value: z.string().min(1, "El ID del miembro es obligatorio"),
  label: z.string().min(1, "El nombre del miembro es obligatorio"),
  role: z.string().min(1, "El rol es obligatorio"),
});

export const formSchema = z.object({
  name: z.string().min(1, { message: "El nombre del equipo es obligatorio" }),
  description: z.string().optional(),
  members: z.array(memberSchema).optional(),
});

export const formSchemaDetails = z.object({
  teamId: z.number().min(1, "El equipo es obligatorio"),
  members: z.array(memberWithRoleSchema).min(1, "Debe invitar al menos a un miembro"),
});

export type TeamFormValues = z.infer<typeof formSchema>;
export type TeamFormValuesDetails = z.infer<typeof formSchemaDetails>;

interface Option {
  label: string;
  value: string;
  avatar?: string;
  email?: string;
}

export function useTeamFormDialog(
  onCreate?: (team: Team) => void,
  openProp?: boolean,
  onOpenChangeProp?: (open: boolean) => void,
  teamId?: number
) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = openProp ?? internalOpen;
  const handleOpenChange = onOpenChangeProp ?? setInternalOpen;
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      members: [],
    },
  });

  const formDetails = useForm<TeamFormValuesDetails>({
    resolver: zodResolver(formSchemaDetails),
    defaultValues: {
      teamId: 0,
      members: [],
    },
  });


  const [users, setUsers] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {

      if (!currentUser) return;
      try {
        const usersList = teamId
          ? await TeamServices.GetListUserByTeam({ id: teamId })
          : await TeamServices.GetListUser({ id: currentUser.id });

        setUsers(usersList);
      } catch (error) {
        console.error("Error loading users:", error);
      }
    };

    if (isOpen) loadUsers();
  }, [isOpen, currentUser]);

  const handleSuccess = (team: Team) => {
    const slug = generateSlug(team.name, team.id!);
    toast.success("Equipo creado", {
      description: "Haz clic aquí para ver el equipo.",
      action: {
        label: "Ver",
        onClick: () => navigate(`/teams/${slug}`),
      },
    });
    onCreate?.(team);
    form.reset();
    handleOpenChange(false);
  };

  const handleError = (err: any, context: string) => {
    const message = err?.message || `Error ${context} el equipo`;
    setError(message);
    console.error(`${context} team error:`, err);
  };

  const onSubmit = async (data: TeamFormValues) => {
    setLoading(true);
    setError(null);

    const payload: Omit<Team, "id"> = {
      name: data.name,
      description: data.description ?? "",
      members: (data.members ?? []).map(m => ({ label: m.label, value: m.value })),
      userId: currentUser?.id ?? "",
      isActive: true,
    };

    try {
      const createdTeam = await TeamServices.CreateTeam(payload);
      handleSuccess(createdTeam);
    } catch (err) {
      handleError(err, "creando");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitInvitation = async (data: TeamFormValuesDetails) => {
    setLoading(true);
    setError(null);

    const payload = {
      teamId: data.teamId,
      members: data.members.map(m => ({ value: m.value, label: m.label, role: m.role })),
    };

    try {

      const success = await TeamServices.invitationMemberTeam(payload);
      if (success) {
        toast.success("Miembros invitados correctamente");
        formDetails.reset();
        handleOpenChange(false);
      } else {
        toast.error("No se pudo invitar a los miembros");
      }
    } catch (err) {
      handleError(err, "invitando a miembros del");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    formDetails,
    users,
    isOpen,
    handleOpenChange,
    onSubmit,
    onSubmitInvitation,
    loading,
    error,
  };
}
