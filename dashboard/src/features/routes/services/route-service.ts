import supabase from "@/services/supabase";
import type { ApiRoute } from "../types";

export default class RouteService {
  static getDetails = async (route_id: string): Promise<ApiRoute> => {
    const { data, error } = await supabase
      .from("routes")
      .select()
      .eq("id", route_id)
      .limit(1)
      .single();
    if (error) throw error;
    return data;
  };

  static getFunctions = async (route_id: string) => {
    const { data, error } = await supabase
      .from("methods")
      .select(
        `
        *,
        functions (name)  
      `,
      )
      .eq("route_id", route_id);
    if (error) throw error;
    return data;
  };

  static mountFunction = async (
    route_id: string,
    function_id: string,
    method_name: string,
  ) => {
    const { data, error } = await supabase
      .from("methods")
      .insert({
        route_id,
        function_id,
        method_name,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  };
}
