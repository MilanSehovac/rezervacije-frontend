import { useState } from 'react';
import { Button } from '../../ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import type { TeamMember } from '../../types';

export default function TeamMemberDialog({ onAdd }: { onAdd: (member: Omit<TeamMember, 'id'>) => void }) {
  const [open, setOpen] = useState(false);
  const [memberData, setMemberData] = useState({ name: '', role: '', specialties: '' });

  const handleAdd = () => {
    if (memberData.name && memberData.role) {
      onAdd(memberData);
      setMemberData({ name: '', role: '', specialties: '' });
      setOpen(false);
    }
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="gap-2">
        <Plus className="w-4 h-4" /> Add Team Member
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Add a stylist, beautician, or other team member to your salon listing
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="memberName">Name *</Label>
              <Input id="memberName" placeholder="e.g., Sarah Johnson" value={memberData.name}
                onChange={(e) => setMemberData({ ...memberData, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="memberRole">Role *</Label>
              <Input id="memberRole" placeholder="e.g., Senior Stylist" value={memberData.role}
                onChange={(e) => setMemberData({ ...memberData, role: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="memberSpecialties">Specialties (Optional)</Label>
              <Input id="memberSpecialties" placeholder="e.g., Color specialist"
                value={memberData.specialties} onChange={(e) => setMemberData({ ...memberData, specialties: e.target.value })} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!memberData.name || !memberData.role} className="bg-gradient-primary">
              Add Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
