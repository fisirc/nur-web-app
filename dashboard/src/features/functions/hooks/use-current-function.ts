import { useQuery } from "@tanstack/react-query";
import type { Function } from "../types";
import FunctionService from "../services/function-servicev";

const useCurrentFunction = ({ function_id }: { function_id: string }) => {
  if (!function_id)
    throw new Error(
      "useCurrentFunction called outside of a function context",
    );

  return useQuery<Function>({
    queryKey: ["function", function_id],
    queryFn: () => FunctionService.getFunction(function_id),
  });
};

export default useCurrentFunction;
