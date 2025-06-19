import supabase from "@/services/supabase";
import type { Project } from "../types";
import type { Organization } from "@/features/orgs/types";

export default class ProjectService {
  static getProject = async (project_id: string): Promise<Project> => {
    const { data, error } = await supabase
      .from("projects")
      .select()
      .eq("id", project_id)
      .limit(1)
      .single();
    if (error) throw error;
    return data;
  };

  static getOrgFromProject = async (
    project_id: string,
  ): Promise<Organization> => {
    const { data, error } = await supabase
      .from("projects")
      .select("organizations(*)")
      .eq("id", project_id)
      .limit(1)
      .single();
    if (error) throw error;
    return data.organizations;
  };
}
