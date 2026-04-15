/* ──────────────────────────────────────────────────────────────────
   Supabase Database Types — mirrors 001_initial_schema.sql
   If you use `supabase gen types typescript` later, replace this file.
   ────────────────────────────────────────────────────────────────── */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          is_admin: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          is_admin?: boolean;
          created_at?: string;
        };
        Update: {
          email?: string | null;
          full_name?: string | null;
          is_admin?: boolean;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          image_url: string | null;
          description: string | null;
          position: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          image_url?: string | null;
          description?: string | null;
          position?: number;
          is_active?: boolean;
        };
        Update: {
          name?: string;
          slug?: string;
          image_url?: string | null;
          description?: string | null;
          position?: number;
          is_active?: boolean;
        };
      };
      brands: {
        Row: {
          id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          description: string | null;
          position: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          logo_url?: string | null;
          description?: string | null;
          position?: number;
          is_active?: boolean;
        };
        Update: {
          name?: string;
          slug?: string;
          logo_url?: string | null;
          description?: string | null;
          position?: number;
          is_active?: boolean;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          short_description: string | null;
          price: number;
          compare_price: number | null;
          sku: string | null;
          category_id: string | null;
          brand_id: string | null;
          stock: number;
          is_featured: boolean;
          is_bestseller: boolean;
          is_active: boolean;
          weight: string | null;
          servings: number | null;
          protein_per_serving: string | null;
          carbs_per_serving: string | null;
          fat_per_serving: string | null;
          energy_per_serving: string | null;
          ingredients: string | null;
          usage_instructions: string | null;
          advanced_details: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          short_description?: string | null;
          price: number;
          compare_price?: number | null;
          sku?: string | null;
          category_id?: string | null;
          brand_id?: string | null;
          stock?: number;
          is_featured?: boolean;
          is_bestseller?: boolean;
          is_active?: boolean;
          weight?: string | null;
          servings?: number | null;
          protein_per_serving?: string | null;
          carbs_per_serving?: string | null;
          fat_per_serving?: string | null;
          energy_per_serving?: string | null;
          ingredients?: string | null;
          usage_instructions?: string | null;
          advanced_details?: Json;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          short_description?: string | null;
          price?: number;
          compare_price?: number | null;
          sku?: string | null;
          category_id?: string | null;
          brand_id?: string | null;
          stock?: number;
          is_featured?: boolean;
          is_bestseller?: boolean;
          is_active?: boolean;
          weight?: string | null;
          servings?: number | null;
          protein_per_serving?: string | null;
          carbs_per_serving?: string | null;
          fat_per_serving?: string | null;
          energy_per_serving?: string | null;
          ingredients?: string | null;
          usage_instructions?: string | null;
          advanced_details?: Json;
        };
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          url: string;
          alt_text: string | null;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          url: string;
          alt_text?: string | null;
          position?: number;
        };
        Update: {
          url?: string;
          alt_text?: string | null;
          position?: number;
        };
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          name: string;
          price: number | null;
          compare_price: number | null;
          stock: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          name: string;
          price?: number | null;
          compare_price?: number | null;
          stock?: number;
        };
        Update: {
          name?: string;
          price?: number | null;
          compare_price?: number | null;
          stock?: number;
        };
      };
      product_flavours: {
        Row: {
          id: string;
          product_id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          name: string;
        };
        Update: {
          name?: string;
        };
      };
      product_sizes: {
        Row: {
          id: string;
          product_id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          name: string;
        };
        Update: {
          name?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_name: string;
          phone: string;
          email: string | null;
          address: string;
          pincode: string;
          notes: string | null;
          status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          subtotal: number;
          discount: number;
          shipping: number;
          total: number;
          coupon_code: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          customer_name: string;
          phone: string;
          email?: string | null;
          address: string;
          pincode: string;
          notes?: string | null;
          status?: string;
          subtotal: number;
          discount?: number;
          shipping?: number;
          total: number;
          coupon_code?: string | null;
        };
        Update: {
          customer_name?: string;
          phone?: string;
          email?: string | null;
          address?: string;
          pincode?: string;
          notes?: string | null;
          status?: string;
          subtotal?: number;
          discount?: number;
          shipping?: number;
          total?: number;
          coupon_code?: string | null;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          product_name: string;
          variant_name: string | null;
          flavour: string | null;
          size: string | null;
          quantity: number;
          price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          product_name: string;
          variant_name?: string | null;
          flavour?: string | null;
          size?: string | null;
          quantity: number;
          price: number;
        };
        Update: {
          product_name?: string;
          variant_name?: string | null;
          flavour?: string | null;
          size?: string | null;
          quantity?: number;
          price?: number;
        };
      };
      coupons: {
        Row: {
          id: string;
          code: string;
          type: 'percentage' | 'fixed';
          value: number;
          min_order: number;
          max_discount: number | null;
          usage_limit: number | null;
          used_count: number;
          expires_at: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          type: 'percentage' | 'fixed';
          value: number;
          min_order?: number;
          max_discount?: number | null;
          usage_limit?: number | null;
          used_count?: number;
          expires_at?: string | null;
          is_active?: boolean;
        };
        Update: {
          code?: string;
          type?: 'percentage' | 'fixed';
          value?: number;
          min_order?: number;
          max_discount?: number | null;
          usage_limit?: number | null;
          used_count?: number;
          expires_at?: string | null;
          is_active?: boolean;
        };
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          customer_name: string;
          email: string | null;
          rating: number;
          comment: string | null;
          is_approved: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          customer_name: string;
          email?: string | null;
          rating: number;
          comment?: string | null;
          is_approved?: boolean;
        };
        Update: {
          customer_name?: string;
          email?: string | null;
          rating?: number;
          comment?: string | null;
          is_approved?: boolean;
        };
      };
      banners: {
        Row: {
          id: string;
          title: string | null;
          subtitle: string | null;
          image_url: string;
          cta_text: string | null;
          cta_link: string | null;
          position: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title?: string | null;
          subtitle?: string | null;
          image_url: string;
          cta_text?: string | null;
          cta_link?: string | null;
          position?: number;
          is_active?: boolean;
        };
        Update: {
          title?: string | null;
          subtitle?: string | null;
          image_url?: string;
          cta_text?: string | null;
          cta_link?: string | null;
          position?: number;
          is_active?: boolean;
        };
      };
      settings: {
        Row: {
          key: string;
          value: string;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: string;
        };
        Update: {
          value?: string;
        };
      };
      home_sections: {
        Row: {
          id: string;
          title: string;
          subtitle: string | null;
          view_all_link: string | null;
          type: 'carousel' | 'grid' | 'tabs';
          category_id: string | null;
          tags: string[] | null;
          position: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          subtitle?: string | null;
          view_all_link?: string | null;
          type: 'carousel' | 'grid' | 'tabs';
          category_id?: string | null;
          tags?: string[] | null;
          position?: number;
          is_active?: boolean;
        };
        Update: {
          title?: string;
          subtitle?: string | null;
          view_all_link?: string | null;
          type?: 'carousel' | 'grid' | 'tabs';
          category_id?: string | null;
          tags?: string[] | null;
          position?: number;
          is_active?: boolean;
        };
      };
    };
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
  };
}

/* ── Convenience aliases ──────────────────────────────────────── */
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

export type Product = Tables<'products'>;
export type Category = Tables<'categories'>;
export type Brand = Tables<'brands'>;
export type ProductImage = Tables<'product_images'>;
export type ProductVariant = Tables<'product_variants'>;
export type ProductFlavour = Tables<'product_flavours'>;
export type ProductSize = Tables<'product_sizes'>;
export type Order = Tables<'orders'>;
export type OrderItem = Tables<'order_items'>;
export type Coupon = Tables<'coupons'>;
export type Review = Tables<'reviews'>;
export type Banner = Tables<'banners'>;
export type Setting = Tables<'settings'>;
export type Profile = Tables<'profiles'>;
export type HomeSection = Tables<'home_sections'>;

export type ProductWithRelations = Product & {
  images: ProductImage[];
  variants: ProductVariant[];
  flavours: ProductFlavour[];
  sizes: ProductSize[];
  category: Category | null;
  brand: Brand | null;
  reviews: Review[];
};
