import { Role } from "./Role";

export interface UserProfile {
  id: string;
  name: string;
  login: string;
  role: Role;
}
