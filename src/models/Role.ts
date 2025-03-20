const POSSIBLE_ROLES = ["STUDENT", "TEACHER", "ADMIN", "DEAN"] as const;

type PossibleRolesType = typeof POSSIBLE_ROLES;

export type Role = PossibleRolesType[number];

export const isRole = (value: string): value is Role => {
  return POSSIBLE_ROLES.includes(value as Role);
};

export const roleToString = (value: Role): string => {
  switch (value) {
    case "STUDENT":
      return "Студент";
    case "TEACHER":
      return "Преподаватель";
    case "ADMIN":
      return "Администратор";
    case "DEAN":
      return "Работник деканата";
  }
};
