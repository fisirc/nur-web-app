import type { OrgMember } from "../types";

const dummyOrgMemberGenerator = (n: number): OrgMember[] => {
  const members: OrgMember[] = [];
  for (let i = 0; i < n; i++) {
    const id = (i + 1).toString();
    members.push({
      id,
      fullName: `Miembro ${id}`,
      avatarUrl: "https://picsum.photos/50",
      email: `miembro${id}@email.com`,
      roleId: "admin",
    });
  }
  return members;
};

export const dummyOrgMembers: OrgMember[] = dummyOrgMemberGenerator(24);
