import supabase from "@/services/supabase";
import type { Project } from "../types";
import type { Organization } from "@/features/orgs/types";
import type { FunctionList } from "@/features/functions/types";
import type { ApiRoute } from "@/features/routes/types";

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

  static getFunctions = async (project_id: string): Promise<FunctionList> => {
    const { data, error } = await supabase.rpc('project_get_functions', { project_id })
    console.log(error);
    if (error) throw error;
    return data;
  }

  static getRoutes = async (project_id: string): Promise<ApiRoute[]> => {
    const { data, error } = await supabase
      .from("routes")
      .select()
      .eq("project_id", project_id)
      .order("path_absolute", { ascending: true });
    console.log({ data, error })
    if (error) throw error;
    return data;
  }
}
