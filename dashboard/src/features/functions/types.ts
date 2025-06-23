import type { Tables } from "@/types/supabase";

export type Function = Tables<"functions">;
export type FunctionDeployment = Tables<"function_deployments"> & {
    project_build_id: Tables<"project_builds">,
};
