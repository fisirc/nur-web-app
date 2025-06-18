import supabase from "@/services/supabase";

import type { Member, Organization } from "../types";

export default class OrgService {
  static getDetails = async (org_id: string): Promise<Organization> => {
    const { data, error } = await supabase
      .from("organizations")
      .select()
      .eq("id", Number(org_id))
      .limit(1)
      .single();
    if (error) throw error;
    return data;
  };

  static getMembers = async (org_id: string): Promise<Member[]> => {
    const { data, error } = await supabase
      .from("users_organizations")
      .select("role, users(*)")
      .eq("organization_id", Number(org_id));
    if (error) throw error;
    return data.map((item) => ({
      ...item.users,
      role: item.role,
    })) as Member[];
  };
}
