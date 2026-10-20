import { PublicRoutes } from "./public.routes";
import { AuthRoutes } from "./auth.routes";
import { SalonLayout, SalonRoutes } from "./salon.routes";
import { Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout/MainLayout";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";
import { lazy } from "react";

const AdminSalonsPage = lazy(() => import("../pages/admin/AdminSalonsPage"));

export const AppRoutes = (
  <>
    <Route path="salon" element={<ProtectedRoute><SalonLayout /></ProtectedRoute>}>
      {SalonRoutes}
    </Route>
    <Route element={<MainLayout />}>
      {PublicRoutes}
      <Route path="admin" element={<ProtectedRoute roles={['admin']}><AdminSalonsPage /></ProtectedRoute>} />
      <Route element={<AuthLayout />}>
        {AuthRoutes}
      </Route>
    </Route>
  </>
);