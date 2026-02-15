export interface LoginApiResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: {
      id: string;
      name: "patient" | "audiologist" | "admin";
      permissions: string[];
    };
    createdAt: string;
    isActive: boolean;
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
