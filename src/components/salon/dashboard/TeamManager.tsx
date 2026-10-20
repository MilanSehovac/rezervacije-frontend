import { useState } from "react";
import { Trash2, UserPlus } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import type { TeamMember } from "../../types";
import { addTeamMember, deleteTeamMember } from "../../../helpers/salonHelpers";
import { getErrorMessage } from "../../../helpers/errors";

interface Props {
  team: TeamMember[];
  onChanged: () => Promise<void> | void;
}

export function TeamManager({ team, onChanged }: Props) {
  const [form, setForm] = useState({ name: "", role: "", specialties: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const add = async () => {
    setBusy(true);
    setError("");
    try {
      await addTeamMember(form);
      setForm({ name: "", role: "", specialties: "" });
      await onChanged();
    } catch (e) {
      setError(getErrorMessage(e, "Could not add team member."));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (member: TeamMember) => {
    if (!window.confirm(`Remove ${member.name}?`)) return;
    setError("");
    try {
      await deleteTeamMember(member.id);
      await onChanged();
    } catch (e) {
      setError(getErrorMessage(e, "Could not remove team member."));
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Every team member can work on one active phase at a time. Without any team members the salon is treated as a single person.
        With two members, two clients can be in their active phases in parallel.
      </p>
      {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

      <div className="space-y-2">
        {team.map((m) => (
          <div key={m.id} className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="font-medium">{m.name}</p>
              <p className="text-sm text-muted-foreground">{m.role}{m.specialties ? ` · ${m.specialties}` : ""}</p>
            </div>
            <Button size="sm" variant="ghost" onClick={() => remove(m)} aria-label={`Remove ${m.name}`}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {team.length === 0 && <p className="text-sm text-muted-foreground">No team members yet.</p>}
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-lg border p-4 md:grid-cols-3">
        <div className="space-y-1">
          <Label>Name</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="space-y-1">
          <Label>Role</Label>
          <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Stylist" />
        </div>
        <div className="space-y-1">
          <Label>Specialties (optional)</Label>
          <Input value={form.specialties} onChange={(e) => setForm({ ...form, specialties: e.target.value })} />
        </div>
        <Button className="gap-2 md:col-span-3 md:w-fit" onClick={add} disabled={busy || !form.name.trim() || !form.role.trim()}>
          <UserPlus className="h-4 w-4" /> Add team member
        </Button>
      </div>
    </div>
  );
}
