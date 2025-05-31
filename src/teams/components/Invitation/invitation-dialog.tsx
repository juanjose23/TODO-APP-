"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail } from "lucide-react"
import { MultiSelect } from "../multi-select"

interface InvitationDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  formDetails: any
  onSubmitInvitation: (data: any) => void
  users: Array<{ value: string; label: string }>
  teamId: number
}

const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "member", label: "Member" },
  { value: "guest", label: "Guest" },
  { value: "owner", label: "Owner" },
]

export function InvitationDialog({
  isOpen,
  onOpenChange,
  formDetails,
  onSubmitInvitation,
  users,
  teamId,
}: InvitationDialogProps) {
  const selectedMembers = formDetails.watch("members") || []

  return (

    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {formDetails.formState.errors.members && (
        <p className="text-destructive text-sm">
          {formDetails.formState.errors.members.message as string}
        </p>
      )}
      <DialogTrigger asChild>
        <Button>
          <Mail className="mr-2 h-4 w-4" />
          Enviar Invitación
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Enviar Nueva Invitación</DialogTitle>
          <DialogDescription>Completa la información para enviar una invitación a un nuevo miembro.</DialogDescription>
        </DialogHeader>

        <Form {...formDetails}>
          <form  onSubmit={formDetails.handleSubmit(onSubmitInvitation)}className="space-y-6">
            <FormField
              control={formDetails.control}
              name="members"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agregar miembros</FormLabel>
                  <FormControl>
                    <MultiSelect
                      id="members"
                      name={field.name}
                      selected={field.value ?? []}
                      onChange={(selected) => {
                        const enriched = selected.map((member) => ({
                          ...member,
                          role: "",
                        }))
                        formDetails.setValue("members", enriched)
                      }}
                      options={users}
                      placeholder="Buscar usuarios..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedMembers.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Asignar roles</h4>
                <div className="space-y-3">
                  {selectedMembers.map((member: any, index: number) => (
                    <div key={member.value} className="flex items-center gap-4">
                      <Input value={member.label} disabled className="bg-muted/50 flex-1" />
                      <div className="flex-1">
                        <FormField
                          control={formDetails.control}
                          name={`members.${index}.role`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Select value={field.value ?? ""} onValueChange={field.onChange}>
                                  <SelectTrigger className="w-full bg-background">
                                    <SelectValue placeholder="Selecciona un rol" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {roleOptions.map((role) => (
                                      <SelectItem key={role.value} value={role.value}>
                                        {role.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <FormField
              control={formDetails.control}
              name="teamId"
              render={({ field }) => <input type="hidden" {...field} value={teamId} />}
            />

            <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-1">
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit"  disabled={selectedMembers.length === 0}>
                Invitar miembros
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
