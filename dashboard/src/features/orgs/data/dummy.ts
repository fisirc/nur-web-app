import type { OrgMember } from "../types";

const dummyOrgMemberGenerator = (n: number): OrgMember[] => {
  const members: OrgMember[] = [];
  for (let i = 0; i < n; i++) {
    const id = (i + 1).toString();
    members.push({
      id,
      github_username: `miembro${id}`,
      avatar_url: "https://picsum.photos/50",
    });
  }
  return members;
};

export const dummyOrgMembers: OrgMember[] = dummyOrgMemberGenerator(6);
