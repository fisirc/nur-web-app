import supabase from "@/services/supabase";
import type { QueryData } from "@supabase/supabase-js";

export default class OrgMembersService {
  static getOrgMembers = async (org_id: number) => {
    const { data, error } = await supabase
      .from('users_organizations')
      .select('users(id, github_username, avatar_url)')
      .eq('organization_id', org_id)
    if (error) throw error;
    return data;
  };
}

export type OrgMember = QueryData<typeof OrgMembersService.getOrgMembers>
