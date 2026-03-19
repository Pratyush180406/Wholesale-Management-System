// Simple client-side auth helpers
// In production, replace with real JWT / session handling

export const AUTH_KEY = "wms_admin_auth";

export interface AuthUser {
  username: string;
  role: string;
  loginTime: number;
}

export function getAuth(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAuth(user: AuthUser) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated(): boolean {
  const auth = getAuth();
  if (!auth) return false;
  // Session expires after 8 hours
  const elapsed = Date.now() - auth.loginTime;
  if (elapsed > 8 * 60 * 60 * 1000) {
    clearAuth();
    return false;
  }
  return true;
}

// Demo credentials — swap with real backend auth
export const DEMO_CREDENTIALS = [
  { username: "admin", password: "admin123", role: "Administrator" },
  { username: "manager", password: "mgr123", role: "Manager" },
];
