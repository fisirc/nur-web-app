import {
  keepPreviousData,
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query";
import type { OrgMember } from "../types";
import { useParams } from "wouter";
import OrgMembersService from "../services/org-members-service";

const useCurrentOrgMembers = (): UseQueryResult<OrgMember[]> => {
  const { org_id } = useParams();

  if (!org_id)
    throw new Error(
      "useCurrentOrgMembers called outside of an organization context",
    );

  return useQuery<OrgMember[]>({
    queryKey: ["org", org_id, "members"],
    queryFn: () => OrgMembersService.getOrgMembers(org_id),
    placeholderData: keepPreviousData,
  });
};

export default useCurrentOrgMembers;
