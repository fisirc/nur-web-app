import type { Enums } from "@/types/supabase";
import {
  CheckCheck,
  Hourglass,
  Loader,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";

type StatusAttribs = {
  label: string;
  Icon: LucideIcon;
  color: string;
};

export default (value: Enums<"deployment_status">): StatusAttribs => {
  switch (value) {
    case "pending":
      return {
        label: "Pendiente",
        Icon: Hourglass,
        color: "text-foreground",
      };
    case "in_progress":
      return {
        label: "En progreso",
        Icon: Loader,
        color: "text-sky-500",
      };
    case "success":
      return {
        label: "Listo",
        Icon: CheckCheck,
        color: "text-emerald-500",
      };
    case "failed":
      return {
        label: "Fallido",
        Icon: TriangleAlert,
        color: "text-rose-500",
      };
  }
};
