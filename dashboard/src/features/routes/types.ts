import type { Tables } from "@/types/supabase";
import type RouteService from "./services/route-service";
import type { ArrayElement } from "@/types";

export type ApiRoute = Tables<'routes'>

export type MountedFunction = ArrayElement<Awaited<ReturnType<typeof RouteService.getFunctions>>>
