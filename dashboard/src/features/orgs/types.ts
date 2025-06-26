import type { Enums, Tables } from "@/types/supabase";
import type { User } from "../users/types";

export type Organization = Tables<"organizations">;

export interface Member extends User {
  role: Enums<"member_role">;
}
