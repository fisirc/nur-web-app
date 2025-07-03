export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      function_deployments: {
        Row: {
          created_at: string | null
          function_id: string
          id: string
          logs: string | null
          project_build_id: string
          status: Database["public"]["Enums"]["deployment_status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          function_id: string
          id?: string
          logs?: string | null
          project_build_id: string
          status?: Database["public"]["Enums"]["deployment_status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          function_id?: string
          id?: string
          logs?: string | null
          project_build_id?: string
          status?: Database["public"]["Enums"]["deployment_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "function_deployments_function_id_fkey"
            columns: ["function_id"]
            isOneToOne: false
            referencedRelation: "functions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "function_deployments_project_build_id_fkey"
            columns: ["project_build_id"]
            isOneToOne: false
            referencedRelation: "project_builds"
            referencedColumns: ["id"]
          },
        ]
      }
      function_executions: {
        Row: {
          created_at: string
          function_id: string
          id: string
          request: string | null
          status_code: number
        }
        Insert: {
          created_at?: string
          function_id: string
          id?: string
          request?: string | null
          status_code: number
        }
        Update: {
          created_at?: string
          function_id?: string
          id?: string
          request?: string | null
          status_code?: number
        }
        Relationships: [
          {
            foreignKeyName: "function_executions_function_id_fkey"
            columns: ["function_id"]
            isOneToOne: false
            referencedRelation: "functions"
            referencedColumns: ["id"]
          },
        ]
      }
      function_logs: {
        Row: {
          created_at: string
          function_id: string
          id: string
          message: string
        }
        Insert: {
          created_at?: string
          function_id: string
          id?: string
          message: string
        }
        Update: {
          created_at?: string
          function_id?: string
          id?: string
          message?: string
        }
        Relationships: [
          {
            foreignKeyName: "function_logs_function_id_fkey"
            columns: ["function_id"]
            isOneToOne: false
            referencedRelation: "functions"
            referencedColumns: ["id"]
          },
        ]
      }
      functions: {
        Row: {
          id: string
          last_invocation: string | null
          name: string
          project_id: string
          size_kb: number | null
        }
        Insert: {
          id?: string
          last_invocation?: string | null
          name: string
          project_id: string
          size_kb?: number | null
        }
        Update: {
          id?: string
          last_invocation?: string | null
          name?: string
          project_id?: string
          size_kb?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "functions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      logs: {
        Row: {
          duration_ms: number
          error_message: string | null
          function_id: string
          id: string
          status_code: number
          timestamp: string
        }
        Insert: {
          duration_ms: number
          error_message?: string | null
          function_id: string
          id?: string
          status_code: number
          timestamp?: string
        }
        Update: {
          duration_ms?: number
          error_message?: string | null
          function_id?: string
          id?: string
          status_code?: number
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "logs_function_id_fkey"
            columns: ["function_id"]
            isOneToOne: false
            referencedRelation: "functions"
            referencedColumns: ["id"]
          },
        ]
      }
      methods: {
        Row: {
          created_at: string
          function_id: string
          method_name: Database["public"]["Enums"]["http_method"]
          route_id: string
        }
        Insert: {
          created_at?: string
          function_id: string
          method_name: Database["public"]["Enums"]["http_method"]
          route_id: string
        }
        Update: {
          created_at?: string
          function_id?: string
          method_name?: Database["public"]["Enums"]["http_method"]
          route_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "methods_function_id_fkey"
            columns: ["function_id"]
            isOneToOne: false
            referencedRelation: "functions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "methods_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      project_builds: {
        Row: {
          branch_name: string
          commit_sha: string
          commit_short_description: string | null
          created_at: string | null
          id: string
          project_id: string
          updated_at: string | null
        }
        Insert: {
          branch_name: string
          commit_sha: string
          commit_short_description?: string | null
          created_at?: string | null
          id?: string
          project_id: string
          updated_at?: string | null
        }
        Update: {
          branch_name?: string
          commit_sha?: string
          commit_short_description?: string | null
          created_at?: string | null
          id?: string
          project_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_builds_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          github_repo_id: string | null
          github_repo_name: string
          id: string
          name: string
          organization_id: string
        }
        Insert: {
          created_at?: string
          github_repo_id?: string | null
          github_repo_name: string
          id?: string
          name: string
          organization_id: string
        }
        Update: {
          created_at?: string
          github_repo_id?: string | null
          github_repo_name?: string
          id?: string
          name?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      routes: {
        Row: {
          created_at: string
          id: string
          path_absolute: string
          project_id: string
        }
        Insert: {
          created_at: string
          id?: string
          path_absolute: string
          project_id: string
        }
        Update: {
          created_at?: string
          id?: string
          path_absolute?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "routes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          github_username: string
          id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          github_username: string
          id?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          github_username?: string
          id?: string
        }
        Relationships: []
      }
      users_organizations: {
        Row: {
          created_at: string
          organization_id: string
          role: Database["public"]["Enums"]["member_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          organization_id: string
          role?: Database["public"]["Enums"]["member_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          organization_id?: string
          role?: Database["public"]["Enums"]["member_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_organizations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_organizations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      project_get_functions: {
        Args: { project_id: string }
        Returns: {
          id: string
          name: string
          size_kb: number
          status: Database["public"]["Enums"]["deployment_status"]
          commit_sha: string
          commit_date: string
          commit_desc: string
        }[]
      }
    }
    Enums: {
      deployment_status: "pending" | "in_progress" | "success" | "failed"
      http_method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
      member_role: "read-only" | "developer" | "admin" | "owner"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      deployment_status: ["pending", "in_progress", "success", "failed"],
      http_method: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      member_role: ["read-only", "developer", "admin", "owner"],
    },
  },
} as const
