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
      activities: {
        Row: {
          activity_description: string
          activity_type: string
          created_at: string
          id: string
          related_course_id: string | null
          related_course_name: string | null
          user_id: string
        }
        Insert: {
          activity_description: string
          activity_type: string
          created_at?: string
          id?: string
          related_course_id?: string | null
          related_course_name?: string | null
          user_id: string
        }
        Update: {
          activity_description?: string
          activity_type?: string
          created_at?: string
          id?: string
          related_course_id?: string | null
          related_course_name?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_related_course_id_fkey"
            columns: ["related_course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_chats: {
        Row: {
          assignment_id: string | null
          created_at: string
          id: string
          messages: Json
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assignment_id?: string | null
          created_at?: string
          id?: string
          messages: Json
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assignment_id?: string | null
          created_at?: string
          id?: string
          messages?: Json
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_chats_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      assignment_materials: {
        Row: {
          assignment_id: string
          content: string | null
          created_at: string
          file_path: string | null
          id: string
          title: string
          type: string
          url: string | null
        }
        Insert: {
          assignment_id: string
          content?: string | null
          created_at?: string
          file_path?: string | null
          id?: string
          title: string
          type: string
          url?: string | null
        }
        Update: {
          assignment_id?: string
          content?: string | null
          created_at?: string
          file_path?: string | null
          id?: string
          title?: string
          type?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assignment_materials_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      assignments: {
        Row: {
          completed: boolean | null
          course_id: string
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          completed?: boolean | null
          course_id: string
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          completed?: boolean | null
          course_id?: string
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assignments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_materials: {
        Row: {
          content: string | null
          course_id: string
          created_at: string | null
          file_path: string | null
          id: string
          title: string
          type: string
          url: string | null
        }
        Insert: {
          content?: string | null
          course_id: string
          created_at?: string | null
          file_path?: string | null
          id?: string
          title: string
          type: string
          url?: string | null
        }
        Update: {
          content?: string | null
          course_id?: string
          created_at?: string | null
          file_path?: string | null
          id?: string
          title?: string
          type?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_materials_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          code: string
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          progress: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          code: string
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          progress?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          code?: string
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          progress?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          content: string | null
          course_id: string | null
          created_at: string | null
          id: string
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      study_sessions: {
        Row: {
          completed: boolean
          course_id: string
          created_at: string
          description: string | null
          duration: number
          id: string
          scheduled_date: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          course_id: string
          created_at?: string
          description?: string | null
          duration: number
          id?: string
          scheduled_date: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          course_id?: string
          created_at?: string
          description?: string | null
          duration?: number
          id?: string
          scheduled_date?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_sessions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_course_owner: {
        Args: { p_course_id: string }
        Returns: boolean
      }
      is_course_owner_for_assignment: {
        Args: { p_assignment_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
