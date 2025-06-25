import type { Enums } from "@/types/supabase";

export default (value: Enums<"member_role">): string => {
  switch (value) {
    case "owner":
      return "Propetiario";
    case "admin":
      return "Administrador";
    case "developer":
      return "Desarrollador";
    case "read-only":
      return "Solo escritura";
  }
};
