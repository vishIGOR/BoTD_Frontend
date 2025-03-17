export interface Request {
  id: string;
  fullName: string;
  groupNumber: string;
  reason: Reason;
  date: string;
  createdAt: string;
  status: string;
  document?: string;
}

export type Reason = "FAMILY" | "ILLNESS" | "STUDENT_ACTIVITY";

export type Status = "PENDING" | "APPROVED" | "DECLINDE";