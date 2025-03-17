const POSSIBLE_ROLES = ["STUDENT", "TEACHER", "ADMIN", "DEAN"] as const;

type PossibleRolesType = typeof POSSIBLE_ROLES;

export type Role = PossibleRolesType[number];

export const isRole = (value: string): value is Role => {
  return POSSIBLE_ROLES.includes(value as Role);
};
