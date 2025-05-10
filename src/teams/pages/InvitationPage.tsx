import { toast } from "sonner"
import InvitationList from "@/teams/components/InvitationList"
import { useInvitationContext } from "../context/InvitationContext";

export default function HomePage() {
 const { respondToInvitation } = useInvitationContext();

  const handleAccept= async (token: string)  => {
    const success = await respondToInvitation(token, "accepted");
    if (success) {
      toast.success("Accepted Invitation");
      
    }
  }

  const handleReject = async (token: string) => {
    // Lógica para rechazar
    const success = await respondToInvitation(token, "declined");
    if (success) {
      toast.success("Declined Invitation");
      
    }
  }

  

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Administración de Invitaciones</h1>
      <InvitationList
        onAccept={handleAccept}
        onReject={handleReject}
       
      />
    </div>
  )
}
