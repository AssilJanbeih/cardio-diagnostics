export interface AuthUser {
  name: string;
  email: string;
  isSuperAdmin: boolean;
  is_enabled: boolean;
  isAdmin: boolean;
  uid: string;
  role: "cs" | "cs-supervisor" | "marketing" | "admin";
}
