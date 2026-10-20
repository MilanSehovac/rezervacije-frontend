import { RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import { AuthProvider } from "./components/context/AuthContext";
import { FavoritesProvider } from "./components/context/FavoritesContext";
import { AppRoutes } from "./routes";

const router = createBrowserRouter(
  createRoutesFromElements(AppRoutes)
);

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <RouterProvider router={router} />
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;