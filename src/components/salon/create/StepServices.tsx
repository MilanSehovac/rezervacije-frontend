import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { CheckCircle2, Plus, Sparkles } from 'lucide-react';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Button } from '../../ui/button';
import TeamMemberDialog from './TeamMemberDialog';
import TeamMemberCard from './TeamMemberCard';
import { Input } from '../../ui/input';
import { Switch } from '../../ui/switch';
import { PhaseEditor } from '../PhaseEditor';
import { getPhases, withPhases } from '../../../helpers/phases';

import type { SalonFormChange, SalonFormData, TeamMember, SalonService} from '../../types';
import { SALON_AVAILABLE_SERVICES  } from "../../constants/salon";

interface Props {
  formData: SalonFormData;
  serviceToggle: (service: SalonService) => void;
  onChange: SalonFormChange;
  onBack: () => void;
  onSubmit: () => void;
  teamMembers: TeamMember[];
  onAddTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  onRemoveTeamMember: (id: TeamMember['id']) => void;
  onServiceUpdate: (id: SalonService['id'], patch: Partial<SalonService>) => void;
  onAddCustomService: () => void;
  isSubmitting: boolean;
  submitError: string;
}

export default function StepServices({ formData, serviceToggle, onChange, onBack, onSubmit, teamMembers, onAddTeamMember, onRemoveTeamMember, onServiceUpdate, onAddCustomService, isSubmitting, submitError }: Props) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5" /> Services Offered</CardTitle>
        <CardDescription>Select all services you provide to help customers find you</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Services */}
        <div className="space-y-4">
          <Label>Services * (select at least 1)</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SALON_AVAILABLE_SERVICES.map(service => (
              <div key={service.id} className="flex items-center space-x-3 p-4 border rounded-xl hover:border-primary cursor-pointer"
                onClick={() => serviceToggle(service)}>
                <input type="checkbox" checked={formData.services.some(s => s.id === service.id)} readOnly />
                <Label className="cursor-pointer flex-1">{service.name}</Label>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{formData.services.length} service{formData.services.length !== 1 ? 's' : ''} selected</p>
            <Button type="button" variant="outline" size="sm" className="gap-1" onClick={onAddCustomService}>
              <Plus className="w-4 h-4" /> Custom service
            </Button>
          </div>
        </div>

        {/* Per-service timing: this is where active and passive time is defined */}
        {formData.services.length > 0 && (
          <div className="space-y-4">
            <div>
              <Label>Timing & price</Label>
              <p className="text-sm text-muted-foreground">
                Split each service into <b>active</b> time (you work on the client) and <b>passive</b> time
                (e.g. colour developing). During passive time you can take other clients.
              </p>
            </div>
            {formData.services.map(service => (
              <div key={service.id} className="space-y-4 rounded-xl border p-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div className="space-y-1 md:col-span-2">
                    <Label>Name</Label>
                    <Input value={service.name} onChange={(e) => onServiceUpdate(service.id, { name: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label>Price</Label>
                    <Input type="number" min={0} value={service.price}
                      onChange={(e) => onServiceUpdate(service.id, { price: Math.max(0, Number(e.target.value) || 0) })} />
                  </div>
                </div>
                <PhaseEditor
                  phases={getPhases(service)}
                  onChange={(phases) => {
                    const updated = withPhases(service, phases);
                    // services with passive time default to sharing that time with other clients
                    onServiceUpdate(service.id, {
                      phases: updated.phases,
                      activeDuration: updated.activeDuration,
                      passiveDuration: updated.passiveDuration,
                      canOverlap: updated.passiveDuration > 0 ? service.canOverlap || !getPhases(service).some(p => p.type === 'passive') : false,
                    });
                  }}
                />
                {service.passiveDuration > 0 && (
                  <label className="flex items-center gap-2 text-sm">
                    <Switch checked={service.canOverlap} onCheckedChange={(v) => onServiceUpdate(service.id, { canOverlap: v })} />
                    Take other clients during the passive time
                  </label>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Specialties */}
        <div className="space-y-2">
          <Label htmlFor="specialties">Specialties (Optional - separate with comma)</Label>
          <Textarea
            id="specialties"
            value={formData.specialties.join(', ')}
            onChange={(e) => {
              const values = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
              onChange('specialties', values);
            }}
          />
        </div>

        {/* Team Members */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Team Members (Optional)</Label>
            <TeamMemberDialog onAdd={onAddTeamMember} />
          </div>
          {teamMembers.map(member => (
            <TeamMemberCard key={member.id} member={member} onRemove={() => onRemoveTeamMember(member.id)} />
          ))}
        </div>

        {submitError && <p className="text-sm text-destructive" role="alert">{submitError}</p>}

        {/* Back & Submit */}
        <div className="flex gap-4">
          <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
          <Button onClick={onSubmit} disabled={formData.services.length < 1 || isSubmitting || formData.services.some(s => !s.name.trim() || s.activeDuration <= 0)} className="flex-1 bg-gradient-primary gap-2">
            <CheckCircle2 className="w-4 h-4" /> {isSubmitting ? 'Saving…' : 'Create salon'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}