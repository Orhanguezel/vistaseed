export interface LibraryItem {
  id: string;
  type: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string | null;
  featured_image: string | null;
  image_url: string | null;
  views: number;
  download_count: number;
  published_at: string | null;
  tags: string | null;
}

export interface LibraryFile {
  id: string;
  library_id: string;
  file_url: string;
  name: string;
  size_bytes: number | null;
  mime_type: string | null;
}

export interface LibraryImage {
  id: string;
  library_id: string;
  image_url: string;
  title: string | null;
  alt: string | null;
}
