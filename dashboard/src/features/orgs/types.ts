export type OrgMemberRole = "owner" | "admin" | "developer" | "read-only";

export type OrgMemberRoleAttribs = {
  value: OrgMemberRole;
  label: String;
};

export type OrgMember = {
  id: string;
  fullName: string;
  avatarUrl: string;
  email: string;
  role: OrgMemberRole;
};
