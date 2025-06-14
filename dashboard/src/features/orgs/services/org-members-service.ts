import { dummyOrgMembers } from "../data/dummy";
import type { OrgMember } from "../types";

export default class OrgMembersService {
  static getOrgMembers = async (org_id: string): Promise<OrgMember[]> => {
    return dummyOrgMembers;
  };
}
