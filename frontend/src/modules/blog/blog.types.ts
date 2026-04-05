export interface BlogPostListItem {
  id: string;
  category: string;
  author: string | null;
  image_url: string | null;
  published_at: string | null;
  display_order: number;
  title: string;
  slug: string;
  excerpt: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string | null;
  updated_at?: string | null;
}

export interface BlogPostDetail extends BlogPostListItem {
  content: string;
}

export interface BlogListResponse {
  data: BlogPostListItem[];
  total: number;
  page: number;
  limit: number;
}
