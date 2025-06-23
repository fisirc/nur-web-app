import { useQuery } from "@tanstack/react-query";
import type { FunctionDeployment } from "../types";
import { useParams } from "wouter";
import FunctionService from "../services/function-servicev";

const useLastFunctionDeployment = () => {
  const { project_id, function_id } = useParams();

  if (!function_id)
    throw new Error(
      "useCurrentFunction called outside of a function context",
    );

  if (!project_id)
    throw new Error(
      "useCurrentFunction called outside of a project context",
    );

  return useQuery<FunctionDeployment>({
    queryKey: ["function_deployment", function_id],
    queryFn: () => FunctionService.getLastDeployment(function_id),
  });
};

export default useLastFunctionDeployment;
