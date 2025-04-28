import { Bell } from "lucide-react"

import { Button } from "@/components/ui/button"


export function NavActions() {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Bell className="h-4 w-4" />
        <span className="sr-only">Notifications</span>
      </Button>
   
    </div>
  )
}
