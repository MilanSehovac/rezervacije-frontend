import { Outlet } from "react-router-dom";
import ProtectedRoute from "../../routes/ProtectedRoute";

const AuthLayout = () => {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
};

export default AuthLayout;