import { lazy } from "react";
import { Route } from "react-router-dom";
import SalonLayout from "../layouts/SalonLayout/SalonLayout";
import ProtectedRoute from "./ProtectedRoute";

const CreatePage = lazy(() => import("../pages/salon/CreatePage").then((m) => ({ default: m.CreatePage })));
const DashboardPage = lazy(() => import("../pages/salon/DashboardPage"));

export { SalonLayout };

export const SalonRoutes = (
  <>
    <Route
      path="create"
      element={
        <ProtectedRoute roles={['salon_owner']}>
          <CreatePage />
        </ProtectedRoute>
      }
    />
    <Route
      path="dashboard"
      element={
        <ProtectedRoute roles={['salon_owner']}>
          <DashboardPage />
        </ProtectedRoute>
      }
    />
  </>
);
