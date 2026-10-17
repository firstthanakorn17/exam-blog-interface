import type { Category } from "@examblog/shared";

const CATEGORY_COLORS: Record<string, string> = {
  architecture: "bg-indigo-50 text-indigo-700 border-indigo-200",
  "architecture/nextjs": "bg-violet-50 text-violet-700 border-violet-200",
  "architecture/react": "bg-sky-50 text-sky-700 border-sky-200",
  tutorials: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export function getCategoryLabel(
  categorySlug: string,
  categories: Category[]
): string {
  const found = categories.find((c) => c.slug === categorySlug);
  return found ? found.name : categorySlug;
}

export function getCategoryBadgeClass(categorySlug: string): string {
  return (
    CATEGORY_COLORS[categorySlug] ||
    "bg-slate-100 text-slate-700 border-slate-200"
  );
}
