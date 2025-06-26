import supabase from "@/services/supabase";
import type { Function, FunctionDeployment } from "../types";

export default class FunctionService {
  static getFunction = async (function_id: string): Promise<Function> => {
    const { data, error } = await supabase
      .from("functions")
      .select()
      .eq("id", function_id)
      .single();
    if (error) throw error;
    return data;
  };

  static getLastDeployment = async (function_id: string): Promise<FunctionDeployment> => {
    const { data, error } = await supabase
      .from("function_deployments")
      .select("*, project_build_id(*)")
      .eq("function_id", function_id)
      .limit(1)
      .single();

    if (error) throw error;
    return data;
  };
}
