import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { useLogout } from "@/auth/hooks/useLogout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, CreditCard, HelpCircle, LogOut, Settings, User } from "lucide-react";

export function UserProfileMenu() {
  const logoutUser = useLogout();
  const { user } = useSelector((state: RootState) => state.auth);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ( event.shiftKey && event.key.toLowerCase() === "p") {
        event.preventDefault();
        console.log("Abrir perfil");
      }
      if (event.shiftKey && event.key.toLowerCase() === "b") {
        event.preventDefault();
        console.log("Abrir facturación");
      }
      if (event.shiftKey && event.key.toLowerCase() === "s") {
        event.preventDefault();
        console.log("Abrir configuración");
      }
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "q") {
        event.preventDefault();
        logoutUser();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [logoutUser]);

  
  const getUserInitials = () => {
    if (!user?.name) return "NA";
    const words = user.name.trim().split(' ');
    const initials = words.map(word => word[0]).join('').substring(0, 2);
    return initials.toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User profile" />
            <AvatarFallback>{getUserInitials()}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name ?? "Nombre de usuario"}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email ?? "correo@ejemplo.com"}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
            <DropdownMenuShortcut>⇧+P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
            <DropdownMenuShortcut>⇧+B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <DropdownMenuShortcut>⇧+S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Bell className="mr-2 h-4 w-4" />
            <span>Notifications</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Help & Support</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logoutUser}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
