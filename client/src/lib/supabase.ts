import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  tagline: string | null;
  hero_image: string | null;
  description: string[];
  highlights: string[];
  cta: {
    text: string;
    buttonLabel: string;
    buttonUrl: string;
  } | null;
  status: 'draft' | 'published' | 'archived';
  display_order: number;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface Media {
  id: string;
  filename: string;
  original_name: string;
  storage_path: string;
  public_url: string;
  mime_type: string;
  file_size: number;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  caption: string | null;
  uploaded_by: string | null;
  uploaded_at: string;
}

export interface FleetVehicle {
  id: string;
  name: string;
  category: string;
  description: string;
  passengers: string;
  luggage: string;
  amenities: string[];
  image: string | null;
  status: 'draft' | 'published' | 'archived';
  display_order: number;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface SiteConfig {
  key: string;
  value: any;
  description: string | null;
  updated_at: string;
  updated_by: string | null;
}

export interface SEOSettings {
  id: string;
  page_type: string;
  page_identifier: string | null;
  title: string | null;
  description: string | null;
  keywords: string[] | null;
  og_image: string | null;
  canonical_url: string | null;
  meta_robots: string;
  structured_data: any | null;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  changes: any | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}
