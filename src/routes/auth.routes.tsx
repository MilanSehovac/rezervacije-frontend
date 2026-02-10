import { Route } from "react-router-dom";
import ProfilePage from "../pages/user/ProfilePage";

export const AuthRoutes = (
<Route path="profile" element={<ProfilePage />} />
);