/** URL-friendly slug: "Studio Ljepota & Stil" -> "studio-ljepota-stil" (kept identical to the backend's slugify). */
export const slugify = (text: string) =>
  String(text || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

/** /salon/12-studio-one */
export const salonPath = (salon: { id: number | string; businessName: string }) => {
  const slug = slugify(salon.businessName);
  return `/salon/${salon.id}${slug ? `-${slug}` : ""}`;
};

/** "12-studio-one" -> 12 */
export const idFromSlug = (param: string | undefined) => {
  const match = /^(\d+)/.exec(param ?? "");
  return match ? Number(match[1]) : null;
};
