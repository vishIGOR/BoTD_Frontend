import { UserProfile } from "./User";

export interface Request {
  id: string;
  creator: UserProfile;
  moderator: UserProfile | null;
  groupNumber: string | null;

  reason: Reason;
  status: Status;
  comment: string;

  createdAt: Date;
  dateStart: Date;
  dateEnd: Date;

  fileInDean: boolean;
  files: { id: string }[];
}

export type Reason = "FAMILY" | "ILLNESS" | "STUDENT_ACTIVITY";

export function reasonToString(reason: Reason): string {
  switch (reason) {
    case "FAMILY":
      return "Семейные обстоятельства";
    case "ILLNESS":
      return "Болезнь";
    case "STUDENT_ACTIVITY":
      return "Студенческая активность";
    default:
      return "Неизвестно";
  }
}

export type Status = "PENDING" | "APPROVED" | "DECLINED";

export function statusToString(status: Status): string {
  switch (status) {
    case "PENDING":
      return "На проверке";
    case "APPROVED":
      return "Подтверждено";
    case "DECLINED":
      return "Отклонено";
    default:
      return "Неизвестно";
  }
}
