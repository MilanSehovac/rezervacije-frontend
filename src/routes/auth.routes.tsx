import { lazy } from "react";
import { Route } from "react-router-dom";

const ProfilePage = lazy(() => import("../pages/user/ProfilePage"));

export const AuthRoutes = <Route path="profile" element={<ProfilePage />} />;
