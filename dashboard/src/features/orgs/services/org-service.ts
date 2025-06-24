import supabase from "@/services/supabase";

import type { Member, Organization } from "../types";
import type { Project } from "@/features/projects/types";
import type { Func } from "@/features/functions/types";

export default class OrgService {
  static getOrganization = async (org_id: string): Promise<Organization> => {
    const { data, error } = await supabase
      .from("organizations")
      .select()
      .eq("id", org_id)
      .limit(1)
      .single();
    if (error) throw error;
    return data;
  };

  static getMembers = async (org_id: string): Promise<Member[]> => {
    const { data, error } = await supabase
      .from("users_organizations")
      .select("role, users(*)")
      .eq("organization_id", org_id);
    if (error) throw error;
    return data.map((item) => ({
      ...item.users,
      role: item.role,
    }));
  };

  static getProjects = async (org_id: string): Promise<Project[]> => {
    const { data, error } = await supabase
      .from("projects")
      .select()
      .eq("organization_id", org_id);
    if (error) throw error;
    return data;
  };
}
