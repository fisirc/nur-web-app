import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import OrgService from "../services/org-service";
import type { Project } from "@/features/projects/types";

const useCurrentOrgProjects = () => {
  const { org_id } = useParams();

  if (!org_id)
    throw new Error(
      "useCurrentOrgProjects called outside of an organization context",
    );

  return useQuery<Project[]>({
    queryKey: ["org", org_id, "members"],
    queryFn: () => OrgService.getProjects(org_id),
    placeholderData: keepPreviousData,
  });
};

export default useCurrentOrgProjects;
