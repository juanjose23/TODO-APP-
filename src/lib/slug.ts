export function generateSlug(name: string, id: number | string): string {
  return `${name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') 
    .replace(/(^-|-$)/g, '')}-${id}`;
}


import { useLocation, matchPath } from "react-router-dom";

export function useSlugFromUrl() {
  const location = useLocation();
  const match = matchPath("/teams/:slug/*", location.pathname); 
  return match?.params?.slug;
}