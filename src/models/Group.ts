import { UserProfile } from "./User";

export interface Group {
  id: string;
  number: number;
  students: UserProfile[];
}
