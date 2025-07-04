import type { Database, Tables } from "@/types/supabase";
import type RouteService from "./services/route-service";
import type { ArrayElement } from "@/types";

export type ApiRoute = Tables<'routes'>

export type MountedFunction = ArrayElement<Awaited<ReturnType<typeof RouteService.getFunctions>>>

export type MethodName = Database['public']['Enums']['http_method']
