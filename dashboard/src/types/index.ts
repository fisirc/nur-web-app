import type { TablerIcon } from "@tabler/icons-react";
import type { LucideIcon } from "lucide-react";

export type URLTab = {
  url: string;
  title: string;
  icon: LucideIcon | TablerIcon;
};

export type ArrayElement<ArrayType extends readonly unknown[]> = 
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
