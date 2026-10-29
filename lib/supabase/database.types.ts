export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          avatar_url: string | null;
          preferences: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string;
          avatar_url?: string | null;
          preferences?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string;
          avatar_url?: string | null;
          preferences?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      characters: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          character_type: "Human" | "Animal" | "Robot" | "Vegetable" | "Fantasy" | "Other";
          personality: string;
          appearance: string;
          clothing: string;
          voice_style: string;
          special_features: string;
          role: string;
          prompt: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          character_type: "Human" | "Animal" | "Robot" | "Vegetable" | "Fantasy" | "Other";
          personality: string;
          appearance: string;
          clothing: string;
          voice_style: string;
          special_features?: string;
          role: string;
          prompt: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          character_type?: string;
          personality?: string;
          appearance?: string;
          clothing?: string;
          voice_style?: string;
          special_features?: string;
          role?: string;
          prompt?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      stories: {
        Row: {
          id: string;
          owner_id: string;
          title: string;
          topic: string;
          style: string;
          duration: string;
          characters: string;
          language: string;
          introduction: string;
          narrator_script: string;
          dialogue: Json;
          ending: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          title: string;
          topic: string;
          style: string;
          duration: string;
          characters: string;
          language: string;
          introduction: string;
          narrator_script: string;
          dialogue?: Json;
          ending: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          title?: string;
          topic?: string;
          style?: string;
          duration?: string;
          characters?: string;
          language?: string;
          introduction?: string;
          narrator_script?: string;
          dialogue?: Json;
          ending?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      story_scenes: {
        Row: {
          id: string;
          owner_id: string;
          story_id: string;
          position: number;
          title: string;
          description: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          story_id: string;
          position: number;
          title: string;
          description: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          story_id?: string;
          position?: number;
          title?: string;
          description?: string;
        };
        Relationships: [];
      };
      content_projects: {
        Row: {
          id: string;
          owner_id: string;
          title: string;
          project_type: string;
          status: string;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          title: string;
          project_type: string;
          status?: string;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          title?: string;
          project_type?: string;
          status?: string;
          metadata?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      media_assets: {
        Row: {
          id: string;
          owner_id: string;
          bucket_id: string;
          object_path: string;
          mime_type: string | null;
          size_bytes: number | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          bucket_id: string;
          object_path: string;
          mime_type?: string | null;
          size_bytes?: number | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          bucket_id?: string;
          object_path?: string;
          mime_type?: string | null;
          size_bytes?: number | null;
          metadata?: Json;
        };
        Relationships: [];
      };
      app_settings: {
        Row: {
          id: string;
          owner_id: string;
          key: string;
          value: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          key: string;
          value?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          key?: string;
          value?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      save_story: {
        Args: {
          p_story_id: string | null;
          p_title: string;
          p_topic: string;
          p_style: string;
          p_duration: string;
          p_characters: string;
          p_language: string;
          p_introduction: string;
          p_narrator_script: string;
          p_dialogue: Json;
          p_ending: string;
          p_scenes: Json;
        };
        Returns: string;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
