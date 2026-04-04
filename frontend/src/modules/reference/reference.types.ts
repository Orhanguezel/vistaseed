export interface ReferenceItem {
  id: string;
  is_published?: boolean;
  is_featured?: boolean;
  display_order?: number;
  featured_image: string | null;
  featured_image_asset_id?: string | null;
  website_url: string | null;
  category_id?: string | null;
  category_name?: string | null;
  category_slug?: string | null;
  title: string;
  slug: string;
  summary: string | null;
  content: string | null;
  featured_image_alt: string | null;
  meta_title: string | null;
  meta_description: string | null;
  images?: string[];
  /** API bazen galeriyi `gallery` olarak döner */
  gallery?: string[];
  storage_image_ids?: string[];
  locale?: string;
  created_at?: string | null;
  updated_at?: string | null;
}

