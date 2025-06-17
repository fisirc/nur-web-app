import type { OrgMemberRole, OrgMemberRoleAttribs } from "../types";

export const orgMemberRoleAttribs: {
  [key in OrgMemberRole]: OrgMemberRoleAttribs;
} = {
  owner: { value: "owner", label: "Propietario" },
  admin: { value: "admin", label: "Administrador" },
  developer: { value: "developer", label: "Desarrollador" },
  "read-only": { value: "read-only", label: "Solo lectura" },
};
