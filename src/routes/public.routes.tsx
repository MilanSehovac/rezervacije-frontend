import { lazy } from "react";
import { Route } from "react-router-dom";

// Pages are split per route so the first visit downloads only what it needs.
const HomePage = lazy(() => import("../pages/public/HomePage"));
const SearchPage = lazy(() => import("../pages/public/SearchPage"));
const ServicesPage = lazy(() => import("../pages/public/ServicesPage"));
const SalonPage = lazy(() => import("../pages/public/SalonPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const LegalPage = lazy(() => import("../pages/public/LegalPage"));

export const PublicRoutes = (
  <>
    <Route index element={<HomePage />} />
    <Route path="search" element={<SearchPage />} />
    <Route path="services" element={<ServicesPage />} />
    {/* /salon/12 and /salon/12-studio-one both work; the page redirects to the canonical slug */}
    <Route path="salon/:slug" element={<SalonPage />} />
    <Route path="privacy-policy" element={<LegalPage />} />
    <Route path="terms-of-service" element={<LegalPage />} />
    <Route path="cookie-policy" element={<LegalPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </>
);
