import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function TeamSearch({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  return (
    <>

      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Buscar equipos..."
        className="pl-9 border-0 bg-muted/50 focus-visible:ring-0 focus-visible:ring-offset-0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </>
  )
}
