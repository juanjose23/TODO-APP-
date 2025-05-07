import * as React from "react"
import { X, Check, ChevronsUpDown } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Define el tipo Option de forma clara
interface Option {
  value: string
  label: string
  avatar?: string | null
  email?: string
}

interface MultiSelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  id?: string
  name?: string
  options: Option[]  
  placeholder?: string
  selected: Option[] 
  onChange: (selected: Option[]) => void
  inputRef?: React.Ref<any>
}

// Función para generar iniciales desde un nombre
const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)
}

// Componente Avatar que muestra ya sea una imagen o iniciales
const Avatar = ({ src, name, size = "h-8 w-8" }: { src?: string; name: string; size?: string }) => {
  if (src) {
    return <img src={src || "/placeholder.svg"} alt={name} className={cn(size, "rounded-full")} />
  }

  return (
    <div
      className={cn(
        size,
        "rounded-full flex items-center justify-center bg-primary text-primary-foreground font-medium",
      )}
    >
      {getInitials(name)}
    </div>
  )
}

export function MultiSelect({
  options,
  placeholder = "Seleccionar...",
  selected,
  onChange,
  id,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const handleUnselect = (item: Option) => {
    onChange(selected.filter((i) => i.value !== item.value))
  }

  const handleSelect = (item: Option) => {
    const isSelected = selected.some((i) => i.value === item.value)
    if (isSelected) {
      onChange(selected.filter((i) => i.value !== item.value))
    } else {
      onChange([...selected, item]) 
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            type="button"
          >
            {selected.length > 0 ? `${selected.length} seleccionado${selected.length > 1 ? "s" : ""}` : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Buscar..." />
            <CommandList>
              <CommandEmpty>No se encontraron resultados.</CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {options.map((option) => {
                  const isSelected = selected.some((item) => item.value === option.value)
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => handleSelect(option)} // Pasa el objeto completo en `onSelect`
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar src={option.avatar ?? undefined} name={option.label} />
                        <div>
                          <span>{option.label}</span>
                          {option.email && <div className="text-xs text-muted-foreground">{option.email}</div>}
                        </div>
                      </div>
                      {isSelected && <Check className="h-4 w-4 opacity-100" />}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selected.map((item) => (
            <Badge key={item.value} variant="secondary" className="flex items-center gap-1 pl-1 pr-1">
              <Avatar src={item.avatar ?? undefined} name={item.label} size="h-5 w-5" />
              <span className="ml-1">{item.label}</span>
              <button
                type="button"
                aria-label={`Eliminar ${item.label}`}
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={() => handleUnselect(item)} 
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
