/** Canonical email normalization shared by auth and password recovery flows. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
