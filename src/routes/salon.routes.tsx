import { Route } from "react-router-dom";
import SalonLayout from "../layouts/SalonLayout/SalonLayout";
import CreatePage from "../pages/salon/CreatePage";
import DashboardPage from "../pages/salon/DashboardPage";

export { SalonLayout };

export const SalonRoutes = (
  <>
    <Route path="create" element={<CreatePage />} />
    <Route path="dashboard" element={<DashboardPage />} />
  </>
);