/**
 * Converts a tower name into a URL-safe slug
 * Example: "Tower 1" -> "tower-1"
 */
export function createSlug(name: string): string {
  return name
    .toLowerCase()
    // Replace any non-alphanumeric characters with a dash
    .replace(/[^a-z0-9]+/g, '-')
    // Remove leading and trailing dashes
    .replace(/(^-|-$)/g, '');
}

/**
 * Converts a slug back into a tower name format
 * Example: "tower-1" -> "Tower 1"
 */
export function slugToName(slug: string): string {
  return slug
    // Replace dashes with spaces
    .replace(/-/g, ' ')
    // Capitalize each word
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Validates if a string is a valid slug
 */
export function isValidSlug(slug: string): boolean {
  // Slug should only contain lowercase letters, numbers, and dashes
  // Should not start or end with a dash
  // Should not have consecutive dashes
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
} 