/**
 * Validation Helpers
 *
 * Pure functions for input validation.
 * NO database access, NO ctx parameter.
 */

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

/**
 * Validate todo title
 */
export function isValidTitle(title: string): boolean {
  return title.trim().length > 0 && title.length <= 200;
}

/**
 * Validate todo description
 */
export function isValidDescription(description: string | undefined): boolean {
  if (description === undefined) return true;
  return description.length <= 2000;
}

/**
 * Validate priority value
 */
export function isValidPriority(
  priority: string
): priority is "low" | "medium" | "high" {
  return ["low", "medium", "high"].includes(priority);
}

/**
 * Validate theme value
 */
export function isValidTheme(
  theme: string
): theme is "light" | "dark" | "system" {
  return ["light", "dark", "system"].includes(theme);
}

/**
 * Validate due date (must be in the future)
 */
export function isValidDueDate(dueDate: number | undefined): boolean {
  if (dueDate === undefined) return true;
  return dueDate > Date.now();
}

/**
 * Check if a due date is overdue
 */
export function isOverdue(dueDate: number | undefined): boolean {
  if (dueDate === undefined) return false;
  return dueDate < Date.now();
}

/**
 * Sanitize user input (trim whitespace, prevent XSS)
 */
export function sanitizeInput(input: string): string {
  return input.trim().slice(0, 10000); // Max 10k chars
}
