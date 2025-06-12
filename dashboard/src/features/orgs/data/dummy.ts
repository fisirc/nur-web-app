import type { OrgMember } from "../types";

export const dummyOrgMembers: OrgMember[] = [
  {
    id: "1",
    fullName: "Rodrigo",
    avatarUrl: "https://picsum.photos/50",
    email: "rojoalsa@yahoo.com",
    roleId: "admin",
  },
  {
    id: "2",
    fullName: "Ruth",
    avatarUrl: "https://picsum.photos/50",
    email: "ruth@unmsm.edu.pe",
    roleId: "admin",
  },
];

// export const dummyOrgMembers = (qp: QueryPagination): OrgMember[] => {
//   const members: OrgMember[] = [];
//   for (let i = 0; i < qp.pageSize; i++) {
//     const id = `${qp.page + i}`;
//     members.push({
//       id,
//       firstName: `First ${id}`,
//       lastName: `Last ${id}`,
//       avatarUrl: "https://picsum.photos/50",
//       email: `person${id}@email.com`,
//       roleId: "admin",
//     });
//   }
//   return members;
// };
