import { useQuery } from "@tanstack/react-query";
import type { FunctionDeployment } from "../types";
import FunctionService from "../services/function-servicev";

const useLastFunctionDeployment = ({ function_id }: { function_id: string }) => {
  if (!function_id)
    throw new Error(
      "useCurrentFunction called outside of a function context",
    );

  return useQuery<FunctionDeployment>({
    queryKey: ["function_deployment", function_id],
    queryFn: () => FunctionService.getLastDeployment(function_id),
  });
};

export default useLastFunctionDeployment;
