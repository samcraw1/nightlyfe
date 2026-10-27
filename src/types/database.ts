/**
 * Supabase types for the Digital Stage schema.
 *
 * GENERATED from supabase/migrations/20260101000000_digital_stage.sql with
 *   npx supabase gen types typescript --db-url <url> --schema public
 * Regenerate after changing the migration; keep the aliases at the bottom.
 */


export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "public": {
          Tables: {
            "digital_stages": {
                  Row: {
                    "active_entertainer_id": string | null,"created_at": string,"id": string,"is_live": boolean,"next_entertainer_id": string | null,"rotation_queue": (string)[],"stream_ended_at": string | null,"stream_started_at": string | null,"updated_at": string,"venue_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "active_entertainer_id"?: string | null,"created_at"?: string,"id"?: string,"is_live"?: boolean,"next_entertainer_id"?: string | null,"rotation_queue"?: (string)[],"stream_ended_at"?: string | null,"stream_started_at"?: string | null,"updated_at"?: string,"venue_id": string
                  }
                  Update: {
                    "active_entertainer_id"?: string | null,"created_at"?: string,"id"?: string,"is_live"?: boolean,"next_entertainer_id"?: string | null,"rotation_queue"?: (string)[],"stream_ended_at"?: string | null,"stream_started_at"?: string | null,"updated_at"?: string,"venue_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "digital_stages_active_entertainer_id_fkey"
      columns: ["active_entertainer_id"]
isOneToOne: false
      referencedRelation: "entertainers"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "digital_stages_next_entertainer_id_fkey"
      columns: ["next_entertainer_id"]
isOneToOne: false
      referencedRelation: "entertainers"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "digital_stages_venue_id_fkey"
      columns: ["venue_id"]
isOneToOne: true
      referencedRelation: "venues"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "digital_stages_venue_id_fkey"
      columns: ["venue_id"]
isOneToOne: true
      referencedRelation: "venues_public"
      referencedColumns: ["id"]
    }
                  ]
                },"entertainers": {
                  Row: {
                    "bio": string | null,"broadcast_consent_at": string | null,"broadcast_consent_version": string | null,"created_at": string,"featured_tonight": boolean,"id": string,"is_active": boolean,"placeholder_hue": number | null,"profile_image_url": string | null,"slug": string,"stage_name": string,"venue_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "bio"?: string | null,"broadcast_consent_at"?: string | null,"broadcast_consent_version"?: string | null,"created_at"?: string,"featured_tonight"?: boolean,"id"?: string,"is_active"?: boolean,"placeholder_hue"?: number | null,"profile_image_url"?: string | null,"slug": string,"stage_name": string,"venue_id": string
                  }
                  Update: {
                    "bio"?: string | null,"broadcast_consent_at"?: string | null,"broadcast_consent_version"?: string | null,"created_at"?: string,"featured_tonight"?: boolean,"id"?: string,"is_active"?: boolean,"placeholder_hue"?: number | null,"profile_image_url"?: string | null,"slug"?: string,"stage_name"?: string,"venue_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "entertainers_venue_id_fkey"
      columns: ["venue_id"]
isOneToOne: false
      referencedRelation: "venues"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "entertainers_venue_id_fkey"
      columns: ["venue_id"]
isOneToOne: false
      referencedRelation: "venues_public"
      referencedColumns: ["id"]
    }
                  ]
                },"stage_audit_log": {
                  Row: {
                    "action": string,"actor_id": string | null,"created_at": string,"detail": NonNullable<Json>,"entity": string,"entity_id": string | null,"id": number,"venue_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "action": string,"actor_id"?: string | null,"created_at"?: string,"detail"?: NonNullable<Json>,"entity": string,"entity_id"?: string | null,"id"?: never,"venue_id": string
                  }
                  Update: {
                    "action"?: string,"actor_id"?: string | null,"created_at"?: string,"detail"?: NonNullable<Json>,"entity"?: string,"entity_id"?: string | null,"id"?: never,"venue_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "stage_audit_log_venue_id_fkey"
      columns: ["venue_id"]
isOneToOne: false
      referencedRelation: "venues"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "stage_audit_log_venue_id_fkey"
      columns: ["venue_id"]
isOneToOne: false
      referencedRelation: "venues_public"
      referencedColumns: ["id"]
    }
                  ]
                },"stream_sessions": {
                  Row: {
                    "digital_stage_id": string,"ended_at": string | null,"entertainer_id": string | null,"id": string,"started_at": string,"status": Database["public"]['Enums']["session_status"],"venue_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "digital_stage_id": string,"ended_at"?: string | null,"entertainer_id"?: string | null,"id"?: string,"started_at"?: string,"status"?: Database["public"]['Enums']["session_status"],"venue_id": string
                  }
                  Update: {
                    "digital_stage_id"?: string,"ended_at"?: string | null,"entertainer_id"?: string | null,"id"?: string,"started_at"?: string,"status"?: Database["public"]['Enums']["session_status"],"venue_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "stream_sessions_digital_stage_id_fkey"
      columns: ["digital_stage_id"]
isOneToOne: false
      referencedRelation: "digital_stages"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "stream_sessions_entertainer_id_fkey"
      columns: ["entertainer_id"]
isOneToOne: false
      referencedRelation: "entertainers"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "stream_sessions_venue_id_fkey"
      columns: ["venue_id"]
isOneToOne: false
      referencedRelation: "venues"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "stream_sessions_venue_id_fkey"
      columns: ["venue_id"]
isOneToOne: false
      referencedRelation: "venues_public"
      referencedColumns: ["id"]
    }
                  ]
                },"venue_staff": {
                  Row: {
                    "created_at": string,"id": string,"role": Database["public"]['Enums']["staff_role"],"user_id": string,"venue_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"id"?: string,"role"?: Database["public"]['Enums']["staff_role"],"user_id": string,"venue_id": string
                  }
                  Update: {
                    "created_at"?: string,"id"?: string,"role"?: Database["public"]['Enums']["staff_role"],"user_id"?: string,"venue_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "venue_staff_venue_id_fkey"
      columns: ["venue_id"]
isOneToOne: false
      referencedRelation: "venues"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "venue_staff_venue_id_fkey"
      columns: ["venue_id"]
isOneToOne: false
      referencedRelation: "venues_public"
      referencedColumns: ["id"]
    }
                  ]
                },"venues": {
                  Row: {
                    "address": string | null,"age_restriction": number | null,"aws_ivs_channel_arn": string | null,"aws_ivs_ingest_endpoint": string | null,"aws_ivs_playback_url": string | null,"city": string | null,"created_at": string,"id": string,"is_active": boolean,"logo_url": string | null,"name": string,"primary_color": string | null,"secondary_color": string | null,"slug": string
                  }
                  ComputedFields: never
                  Insert: {
                    "address"?: string | null,"age_restriction"?: number | null,"aws_ivs_channel_arn"?: string | null,"aws_ivs_ingest_endpoint"?: string | null,"aws_ivs_playback_url"?: string | null,"city"?: string | null,"created_at"?: string,"id"?: string,"is_active"?: boolean,"logo_url"?: string | null,"name": string,"primary_color"?: string | null,"secondary_color"?: string | null,"slug": string
                  }
                  Update: {
                    "address"?: string | null,"age_restriction"?: number | null,"aws_ivs_channel_arn"?: string | null,"aws_ivs_ingest_endpoint"?: string | null,"aws_ivs_playback_url"?: string | null,"city"?: string | null,"created_at"?: string,"id"?: string,"is_active"?: boolean,"logo_url"?: string | null,"name"?: string,"primary_color"?: string | null,"secondary_color"?: string | null,"slug"?: string
                  }
                  Relationships: [
                    
                  ]
                }
          }
          Views: {
            "venues_public": {
                  Row: {
                    "address": string | null,"age_restriction": number | null,"aws_ivs_playback_url": string | null,"city": string | null,"id": string,"logo_url": string | null,"name": string,"primary_color": string | null,"secondary_color": string | null,"slug": string
                  }
                  ComputedFields: never
                  Insert: {
                           "address"?: string | null,"age_restriction"?: number | null,"aws_ivs_playback_url"?: string | null,"city"?: string | null,"id"?: string | null,"logo_url"?: string | null,"name"?: string | null,"primary_color"?: string | null,"secondary_color"?: string | null,"slug"?: string | null
                         }
                        Update: {
                           "address"?: string | null,"age_restriction"?: number | null,"aws_ivs_playback_url"?: string | null,"city"?: string | null,"id"?: string | null,"logo_url"?: string | null,"name"?: string | null,"primary_color"?: string | null,"secondary_color"?: string | null,"slug"?: string | null
                         }
                        Relationships: [
                    
                  ]
                }
          }
          Functions: {
            "assert_stage_entertainer":
{ Args: { "p_entertainer": string,"p_venue": string }; Returns: undefined
                           },
"end_stage_broadcast":
{ Args: { "p_stage": string }; Returns: undefined
                           },
"is_venue_staff":
{ Args: { "p_venue": string }; Returns: boolean
                           },
"log_stage_action":
{ Args: { "p_action": string,"p_detail"?: Json,"p_entity": string,"p_entity_id": string,"p_venue": string }; Returns: undefined
                           },
"log_stream_key_reveal":
{ Args: { "p_venue": string }; Returns: undefined
                           },
"my_venue_role":
{ Args: { "p_venue": string }; Returns: Database["public"]['Enums']["staff_role"]
                           },
"rotate_stage_session":
{ Args: { "p_entertainer": string,"p_stage": Omit<Database["public"]['Tables']["digital_stages"]['Row'], Database["public"]['Tables']["digital_stages"]['ComputedFields']> }; Returns: undefined
                           },
"set_stage_rotation":
{ Args: { "p_active": string,"p_next": string,"p_queue": (string)[],"p_stage": string }; Returns: undefined
                           },
"start_stage_broadcast":
{ Args: { "p_entertainer": string,"p_stage": string }; Returns: undefined
                           },
"venue_is_active":
{ Args: { "p_venue": string }; Returns: boolean
                           }
          }
          Enums: {
            "session_status": "live"|"ended"|"cancelled","staff_role": "owner"|"manager"|"broadcaster"
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "public": {
          Enums: {
            "session_status": ["live", "ended", "cancelled"],"staff_role": ["owner", "manager", "broadcaster"]
          }
        }
} as const

// ---- Convenience aliases used by the app ----------------------------------
export type VenueRow = Tables<"venues">;
export type VenuePublicRow = Tables<"venues_public">;
export type EntertainerRow = Tables<"entertainers">;
export type DigitalStageRow = Tables<"digital_stages">;
export type StreamSessionRow = Tables<"stream_sessions">;
export type VenueStaffRow = Tables<"venue_staff">;
export type StageAuditRow = Tables<"stage_audit_log">;
export type StaffRole = Enums<"staff_role">;
export type SessionStatus = Enums<"session_status">;
