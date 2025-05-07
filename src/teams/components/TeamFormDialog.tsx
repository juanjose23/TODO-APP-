import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "./multi-select";

import { useTeamFormDialog } from "@/teams/hooks/useTeamFormDialog";
import type { Team } from "@/teams/types/TeamTypes";

type Props = {
  onCreate: (team: Team) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function TeamFormDialog({
  onCreate,
  open,
  onOpenChange,
}: Props) {
  const {
    form,
    users,
    isOpen,
    handleOpenChange,
    onSubmit,
  } = useTeamFormDialog(onCreate, open, onOpenChange);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] border-0 p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-xl">Crear nuevo equipo</DialogTitle>
          <DialogDescription>
            Crea un equipo y añade miembros para colaborar
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del equipo</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nombre del equipo"
                          {...field}
                          className="border-0 bg-muted/50 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="members"
                  render={({ field }) => {
                    console.log('DATOS SELECCIONADOS')
                    console.table(field.value);

                    return (
                      <FormItem>
                        <FormLabel>Agregar miembros</FormLabel>
                        <FormControl>
                          <MultiSelect
                            id="members"
                            name={field.name}
                            selected={field.value ?? []}
                            onChange={field.onChange}
                            options={users}
                            placeholder="Buscar usuarios..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe el propósito de este equipo (opcional)"
                        {...field}
                        className="border-0 bg-muted/50 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4 pb-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => handleOpenChange(false)}
                  className="border-0"
                >
                  Cancelar
                </Button>
                <Button type="submit">Crear equipo</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
