export const isValidSlug = (slug: string | undefined) =>
  typeof slug === "string" &&
  slug.trim().length !== 0 &&
  !/[^0-9a-zA-Z-_]/.test(slug.trim()) &&
  /^[a-zA-Z]/.test(slug.trim());
