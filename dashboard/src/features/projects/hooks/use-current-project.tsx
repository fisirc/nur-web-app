import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { useParams } from "wouter";
import ProjectService from "../services/project-service";
import type { ProjectInfo } from "../types";

const useCurrentProject = (): UseQueryResult<ProjectInfo> => {
  const { project_id } = useParams();

  if (!project_id)
    throw new Error("useCurrentProject called outside of a project context");

  return useQuery<ProjectInfo>({
    queryKey: ["project", project_id, "info"],
    queryFn: () => ProjectService.getProjectInfo(project_id),
  });
};

export default useCurrentProject;
