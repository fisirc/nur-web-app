import type { Tables } from "@/types";

export type OrgMemberRole = "owner" | "admin" | "developer" | "read-only";

export type OrgMemberRoleAttribs = {
  value: OrgMemberRole;
  label: String;
};

export type OrgMember = Tables<'users'>