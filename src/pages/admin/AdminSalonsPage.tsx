import { useCallback, useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import LoadingSpinner from "../../components/ui/loadingSpinner";
import instance from "../../config/AxiosConfig";
import { getErrorMessage } from "../../helpers/errors";
import type { SalonService } from "../../components/types";
import { Seo } from "../../components/Seo";

type AdminSalon = {
  id: number;
  businessName: string;
  category: string;
  city: string | null;
  email: string;
  phone: string;
  isApproved: boolean;
  createdAt: string;
  owner?: { firstName: string; lastName: string; email: string };
  services: SalonService[];
};

type Filter = "pending" | "approved" | "all";

const AdminSalonsPage = () => {
  const [filter, setFilter] = useState<Filter>("pending");
  const [salons, setSalons] = useState<AdminSalon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await instance.get("/admin/salons", { params: { status: filter } });
      setSalons(res.data);
    } catch (e) {
      setError(getErrorMessage(e, "Could not load salons."));
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const setApproval = async (id: number, isApproved: boolean) => {
    try {
      await instance.patch(`/admin/salons/${id}`, { isApproved });
      await load();
    } catch (e) {
      setError(getErrorMessage(e, "Could not update the salon."));
    }
  };

  return (
    <div className="space-y-6">
      <Seo title="Salon approvals" noindex />
      <h1 className="text-3xl font-bold">Salon approvals</h1>
      <div className="flex gap-2">
        {(["pending", "approved", "all"] as Filter[]).map((f) => (
          <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" className="capitalize" onClick={() => setFilter(f)}>
            {f}
          </Button>
        ))}
      </div>
      {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
      {loading && <LoadingSpinner loading singular={false} />}
      {!loading && salons.length === 0 && <p className="text-sm text-muted-foreground">Nothing here.</p>}
      {!loading &&
        salons.map((salon) => (
          <Card key={salon.id}>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {salon.businessName}
                  <Badge variant={salon.isApproved ? "default" : "secondary"}>{salon.isApproved ? "approved" : "pending"}</Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {salon.category} · {salon.city || "no city"} · {salon.email} · {salon.phone}
                </p>
                {salon.owner && (
                  <p className="text-sm text-muted-foreground">
                    Owner: {salon.owner.firstName} {salon.owner.lastName} ({salon.owner.email})
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {!salon.isApproved && <Button size="sm" onClick={() => setApproval(salon.id, true)}>Approve</Button>}
                {salon.isApproved && <Button size="sm" variant="destructive" onClick={() => setApproval(salon.id, false)}>Unpublish</Button>}
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {salon.services.length} service{salon.services.length === 1 ? "" : "s"}: {salon.services.map((s) => s.name).join(", ") || "none"}
            </CardContent>
          </Card>
        ))}
    </div>
  );
};

export default AdminSalonsPage;
