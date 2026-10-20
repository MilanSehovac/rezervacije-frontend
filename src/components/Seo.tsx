import { useEffect } from "react";
import { SITE_URL } from "../helpers/siteUrl";

const SITE_NAME = "BeautyBook";

interface SeoProps {
  /** Page title without the site name. Omit on the home page. */
  title?: string;
  description?: string;
  /** Path used for the canonical URL, e.g. "/salon/12-studio-one". Defaults to the current path without query. */
  path?: string;
  /** Private or low-value pages: tells search engines not to index them. */
  noindex?: boolean;
  image?: string;
  /** schema.org structured data */
  jsonLd?: Record<string, unknown>;
}

const DEFAULT_DESCRIPTION =
  "Find salons, barbers, nail studios and spas near you and book appointments online. See real prices, opening hours and reviews.";

function setMeta(attr: "name" | "property", key: string, content: string | null) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (content === null) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/** Keeps <title>, meta description, canonical, Open Graph and JSON-LD in sync with the current page. */
export function Seo({ title, description = DEFAULT_DESCRIPTION, path, noindex = false, image, jsonLd }: SeoProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} – Book salon, barber and spa appointments online`;
  const canonicalPath = path ?? window.location.pathname;
  const canonical = `${SITE_URL}${canonicalPath === "/" ? "/" : canonicalPath.replace(/\/+$/, "")}`;
  const jsonLdText = jsonLd ? JSON.stringify(jsonLd) : null;

  useEffect(() => {
    document.title = fullTitle;
    setMeta("name", "description", description.slice(0, 300));
    setMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description.slice(0, 300));
    setMeta("property", "og:url", canonical);
    setMeta("property", "og:image", image ?? null);
    setMeta("name", "twitter:card", image ? "summary_large_image" : "summary");

    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical;

    document.getElementById("seo-jsonld")?.remove();
    if (jsonLdText) {
      const script = document.createElement("script");
      script.id = "seo-jsonld";
      script.type = "application/ld+json";
      script.text = jsonLdText;
      document.head.appendChild(script);
    }
    return () => document.getElementById("seo-jsonld")?.remove();
  }, [fullTitle, description, canonical, noindex, image, jsonLdText]);

  return null;
}
