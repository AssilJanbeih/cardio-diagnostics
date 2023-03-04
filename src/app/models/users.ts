export class User {
  adminId: string;
  email: string;
  name: string;
  is_enabled: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  role: "cs" | "cs-supervisor" | "marketing" | "admin";
  dateCreated?: Date;
}
