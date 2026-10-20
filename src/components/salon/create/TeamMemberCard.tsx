import { Card, CardContent } from '../../ui/card';
import { Users, Trash2 } from 'lucide-react';
import { Button } from '../../ui/button';
import type { TeamMember } from '../../types';

interface Props {
  member: TeamMember;
  onRemove: () => void;
}

export default function TeamMemberCard({ member, onRemove }: Props) {
  return (
    <Card className="border-muted">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-medium">{member.name}</h4>
            <p className="text-sm text-muted-foreground">{member.role}</p>
            {member.specialties && <p className="text-xs text-muted-foreground mt-1">Specializes in: {member.specialties}</p>}
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onRemove}>
          <Trash2 className="w-4 h-4 text-destructive" />
        </Button>
      </CardContent>
    </Card>
  );
}
