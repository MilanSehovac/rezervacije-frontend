import { Route } from "react-router-dom";
import HomePage from "../pages/public/HomePage";
import SearchPage from "../pages/public/SearchPage";
import ServicesPage from "../pages/public/ServicesPage";
import SalonPage from "../pages/public/SalonPage";
import NotFoundPage from "../pages/NotFoundPage";

export const PublicRoutes = (
    <>
    <Route index element={<HomePage />} />
    <Route path="search" element={<SearchPage />} />
    <Route path="services" element={<ServicesPage />} />
    <Route path="salon/:id" element={<SalonPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </>
);
