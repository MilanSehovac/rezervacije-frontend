import { RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import { AuthProvider } from "./components/context/AuthContext";
import { AppRoutes } from "./routes";

const router = createBrowserRouter(
  createRoutesFromElements(AppRoutes)
);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;