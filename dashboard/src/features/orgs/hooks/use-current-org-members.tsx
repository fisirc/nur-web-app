import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import OrgService from "../services/org-service";
import type { Member } from "../types";

const useCurrentOrgMembers = () => {
  const { org_id } = useParams();

  if (!org_id)
    throw new Error(
      "useCurrentOrgMembers called outside of an organization context",
    );

  return useQuery<Member[]>({
    queryKey: ["org", org_id, "members"],
    queryFn: () => OrgService.getMembers(org_id),
    placeholderData: keepPreviousData,
  });
};

export default useCurrentOrgMembers;
