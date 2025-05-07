import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "../tasks/components/app-sidebar";
import { ModeToggle } from "@/components/ModeToggle";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { NavActions } from "../tasks/components/nav-actions"
import { UserProfileMenu } from "../tasks/components/user-profile-menu"
import { Outlet } from "react-router-dom";
export default function AppLayout() {


  return (
    <SidebarProvider>

      <AppSidebar />

      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">Project Management & Task Tracking</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-4 px-3">
            <NavActions />
            <ModeToggle />
            <UserProfileMenu />
          </div>
        </header>
        <main className="p-4">
          {<Outlet />}
        </main>
        
      </SidebarInset>

    </SidebarProvider>
  )
}
