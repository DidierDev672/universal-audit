export interface UserRole {
  id: string;
  name: "patient" | "audiologist" | "admin";
  permissions: string[];
}

export class User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  constructor(
    id: string,
    email: string,
    name: string,
    role: UserRole,
    isActive: boolean,
  ) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.role = role;
    this.isActive = isActive;

    this.validate();
  }

  private validate(): void {
    if (!this.email || !this.email.includes("@")) {
      throw new Error("Email invalido");
    }

    if (!this.name || this.name.trim().length < 2) {
      throw new Error("Nombre debe tener al menos 2 caracteres");
    }
  }

  get fullInfo(): string {
    return `${this.name} (${this.role.name})`;
  }

  hasPermission(permission: string): boolean {
    return this.role.permissions.includes(permission);
  }

  isPatient(): boolean {
    return this.role.name === "patient";
  }

  isAudiologist(): boolean {
    return this.role.name === "audiologist";
  }
}
