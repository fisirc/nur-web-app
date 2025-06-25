import type { ArrayElement } from "@/types";
import type { Database, Tables } from "@/types/supabase";

export type Function = Tables<"functions">;
export type FunctionDeployment = Tables<"function_deployments"> & {
    project_build_id: Tables<"project_builds">,
};
export type FunctionList = Database['public']['Functions']['project_get_functions']['Returns']
export type FunctionListElem = ArrayElement<FunctionList>