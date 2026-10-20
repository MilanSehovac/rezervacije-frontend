import { useState } from "react";
import { Shield } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import instance from "../../config/AxiosConfig";
import { getErrorMessage } from "../../helpers/errors";
import { useAuth } from "../context/AuthContext";

/** Change password and delete account. Both ask for the current password. */
export function SecuritySettings() {
  const { setUser, refreshSession } = useAuth();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await instance.post("/users/me/password", { currentPassword: current, newPassword: next });
      setCurrent("");
      setNext("");
      setMessage("Password changed.");
    } catch (err) {
      setError(getErrorMessage(err, "Could not change the password."));
    } finally {
      setBusy(false);
    }
  };

  const deleteAccount = async () => {
    setDeleteError("");
    try {
      await instance.delete("/users/me", { data: { password: deletePassword } });
      setUser(null);
      await refreshSession();
      window.location.assign("/");
    } catch (err) {
      setDeleteError(getErrorMessage(err, "Could not delete the account."));
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" aria-hidden="true" />
          Security
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <form onSubmit={changePassword} className="space-y-3">
          <h3 className="font-medium">Change password</h3>
          <div className="space-y-1">
            <Label htmlFor="current-password">Current password</Label>
            <Input id="current-password" type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="new-password">New password (at least 8 characters)</Label>
            <Input id="new-password" type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} />
          </div>
          {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
          {message && <p className="text-sm text-green-600">{message}</p>}
          <Button type="submit" disabled={busy || !current || next.length < 8}>Change password</Button>
        </form>

        <div className="space-y-3 border-t pt-6">
          <h3 className="font-medium text-destructive">Delete account</h3>
          <p className="text-sm text-muted-foreground">
            Your upcoming appointments are cancelled. If you own a salon, it is taken offline and its upcoming bookings are cancelled too.
          </p>
          {!confirmDelete ? (
            <Button variant="outline" className="text-destructive hover:text-destructive" onClick={() => setConfirmDelete(true)}>
              Delete my account
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="delete-password">Enter your password to confirm</Label>
                <Input id="delete-password" type="password" autoComplete="current-password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} />
              </div>
              {deleteError && <p className="text-sm text-destructive" role="alert">{deleteError}</p>}
              <div className="flex gap-2">
                <Button variant="destructive" disabled={!deletePassword} onClick={deleteAccount}>Permanently delete</Button>
                <Button variant="outline" onClick={() => { setConfirmDelete(false); setDeletePassword(""); setDeleteError(""); }}>Cancel</Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
