import { useQuery } from "@tanstack/react-query";
import type { Function } from "../types";
import { useParams } from "wouter";
import FunctionService from "../services/function-servicev";

const useCurrentFunction = () => {
  const { project_id, function_id } = useParams();

  if (!function_id)
    throw new Error(
      "useCurrentFunction called outside of a function context",
    );

  if (!project_id)
    throw new Error(
      "useCurrentFunction called outside of a project context",
    );

  return useQuery<Function>({
    queryKey: ["function", function_id],
    queryFn: () => FunctionService.getFunction(function_id, project_id),
  });
};

export default useCurrentFunction;
