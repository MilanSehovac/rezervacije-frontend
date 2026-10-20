import { CheckCircle2, Clock, LayoutDashboard } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { CardContent } from "../../ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../ui/dialog"
import { Button } from "../../ui/button"
interface Props {
    open: boolean, 
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>, 
    newListing: () => void
}
const SuccessModal = ({open, onOpenChange, newListing}: Props) => {
  const navigate = useNavigate();
  if (!open) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold">Listing Submitted!</DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          Your salon is saved. Once it is approved it appears in the public directory; you can manage services, team and bookings from your dashboard.
        </DialogDescription>
      </DialogHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <CheckCircle2 className="w-6 h-6 text-green-500" />
          <p className="text-sm text-muted-foreground">Listing submitted successfully</p>
        </div>
        <div className="flex items-center space-x-4">
          <Clock className="w-6 h-6 text-gray-500" />
          <p className="text-sm text-muted-foreground">Visible to customers after approval</p>
        </div>
      </CardContent>
      <DialogFooter>
        <Button onClick={() => { onOpenChange(false); newListing(); navigate('/salon/dashboard'); }} className="bg-gradient-primary">
          <LayoutDashboard className="w-4 h-4" />
          Go to dashboard
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  )
}

export default SuccessModal