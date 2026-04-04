// =============================================================
// FILE: src/navigation/sidebar/sidebar-items.ts
// vistaseed — Sidebar navigation (Kurumsal Site)
// =============================================================

import {
  BookOpen,
  Briefcase,
  Contact2,
  Database,
  FileText,
  FolderTree,
  GalleryHorizontalEnd,
  HardDrive,
  HelpCircle,
  Megaphone,
  Newspaper,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Package,
  Palette,
  Send,
  Settings,
  ShoppingBag,
  Star,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { TranslateFn } from '@/i18n/translation-utils';
import { getAdminNavRoles } from '@/navigation/permissions';
import type { AdminNavKey } from '@/navigation/permissions';
import type { PanelRole } from '@/navigation/permissions';

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export type AdminSidebarRole = PanelRole;

export type AdminNavItemKey = AdminNavKey;

export type AdminNavGroupKey = 'general' | 'content' | 'hr' | 'communication' | 'users_group' | 'system';

export type AdminNavConfigItem = {
  key: AdminNavItemKey;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  roles?: AdminSidebarRole[];
};

export type AdminNavConfigGroup = {
  id: number;
  key: AdminNavGroupKey;
  items: AdminNavConfigItem[];
};

export const adminNavConfig: AdminNavConfigGroup[] = [
  {
    id: 1,
    key: 'general',
    items: [
      { key: 'dashboard', url: '/admin/dashboard', icon: LayoutDashboard },
      { key: 'products', url: '/admin/products', icon: Package },
    ],
  },
  {
    id: 2,
    key: 'content',
    items: [
      { key: 'categories', url: '/admin/categories', icon: FolderTree },
      { key: 'custom_pages', url: '/admin/custom-pages', icon: FileText },
      { key: 'gallery', url: '/admin/gallery', icon: GalleryHorizontalEnd },
      { key: 'references', url: '/admin/references', icon: Star },
      { key: 'library', url: '/admin/library', icon: BookOpen },
      { key: 'blog', url: '/admin/blog', icon: Newspaper },
      { key: 'support', url: '/admin/support', icon: HelpCircle },
      { key: 'popups', url: '/admin/popups', icon: Megaphone },
    ],
  },
  {
    id: 3,
    key: 'hr',
    items: [
      { key: 'job_listings', url: '/admin/job-listings', icon: Briefcase },
      { key: 'job_applications', url: '/admin/job-applications', icon: ShoppingBag },
    ],
  },
  {
    id: 4,
    key: 'communication',
    items: [
      { key: 'contacts', url: '/admin/contacts', icon: Contact2 },
      { key: 'email_templates', url: '/admin/email-templates', icon: Mail },
      { key: 'offers', url: '/admin/offers', icon: FileText },
    ],
  },
  {
    id: 5,
    key: 'users_group',
    items: [
      { key: 'users', url: '/admin/users', icon: Users },
    ],
  },
  {
    id: 6,
    key: 'system',
    items: [
      { key: 'site_settings', url: '/admin/site-settings', icon: Settings },
      { key: 'storage', url: '/admin/storage', icon: HardDrive },
      { key: 'theme', url: '/admin/theme', icon: Palette },
      { key: 'telegram', url: '/admin/telegram', icon: Send },
      { key: 'audit', url: '/admin/audit', icon: MessageSquare },
      { key: 'db_admin', url: '/admin/db-admin', icon: Database },
    ],
  },
];

export const ADMIN_NAV_TITLE_KEY_PREFIX = 'admin.sidebar.items';
export const ADMIN_NAV_LEGACY_TITLE_KEY_PREFIX = 'admin.dashboard.items';
export const ADMIN_NAV_GROUP_LABEL_KEY_PREFIX = 'admin.sidebar.groups';

export type AdminNavCopy = {
  labels: Record<AdminNavGroupKey, string>;
  items: Record<AdminNavItemKey, string>;
};

const FALLBACK_GROUP_LABELS: Record<AdminNavGroupKey, string> = {
  general: 'Genel',
  content: 'İçerik',
  hr: 'İnsan Kaynakları',
  communication: 'İletişim',
  users_group: 'Kullanıcılar',
  system: 'Sistem',
};

const FALLBACK_TITLES: Record<AdminNavItemKey, string> = {
  dashboard: 'Dashboard',
  products: 'Ürünler',
  categories: 'Kategoriler',
  custom_pages: 'Sayfalar',
  gallery: 'Galeri',
  references: 'Referanslar',
  library: 'Kütüphane',
  blog: 'Blog',
  support: 'SSS / Destek',
  job_listings: 'İş İlanları',
  job_applications: 'Başvurular',
  contacts: 'İletişim Mesajları',
  email_templates: 'E-posta Şablonları',
  offers: 'Teklifler',
  users: 'Kullanıcılar',
  site_settings: 'Site Ayarları',
  storage: 'Depolama',
  theme: 'Tema',
  telegram: 'Telegram',
  audit: 'Denetim',
  db_admin: 'Veritabanı',
  popups: 'Popup\'lar',
};

export const ADMIN_NAV_ROUTE_MAP: Record<AdminNavItemKey, string> = adminNavConfig
  .flatMap((group) => group.items)
  .reduce(
    (acc, item) => {
      acc[item.key] = item.url;
      return acc;
    },
    {} as Record<AdminNavItemKey, string>,
  );

export function getAdminNavGroupLabelKey(groupKey: AdminNavGroupKey): `${typeof ADMIN_NAV_GROUP_LABEL_KEY_PREFIX}.${AdminNavGroupKey}` {
  return `${ADMIN_NAV_GROUP_LABEL_KEY_PREFIX}.${groupKey}`;
}

export function getAdminNavTitleKey(key: AdminNavItemKey): `${typeof ADMIN_NAV_TITLE_KEY_PREFIX}.${AdminNavItemKey}` {
  return `${ADMIN_NAV_TITLE_KEY_PREFIX}.${key}`;
}

export function getAdminLegacyNavTitleKey(
  key: AdminNavItemKey,
): `${typeof ADMIN_NAV_LEGACY_TITLE_KEY_PREFIX}.${AdminNavItemKey}` {
  return `${ADMIN_NAV_LEGACY_TITLE_KEY_PREFIX}.${key}`;
}

export function getAdminNavFallbackTitle(key: AdminNavItemKey): string {
  return FALLBACK_TITLES[key] || key;
}

export function getAdminNavFallbackGroupLabel(groupKey: AdminNavGroupKey): string {
  return FALLBACK_GROUP_LABELS[groupKey] || '';
}

export function getAdminNavUrl(key: AdminNavItemKey): string {
  return ADMIN_NAV_ROUTE_MAP[key];
}

export function buildAdminSidebarItems(
  copy?: Partial<AdminNavCopy> | null,
  t?: TranslateFn,
  role: AdminSidebarRole = 'admin',
): NavGroup[] {
  const labels = copy?.labels ?? ({} as AdminNavCopy['labels']);
  const items  = copy?.items  ?? ({} as AdminNavCopy['items']);

  return adminNavConfig.map((group) => {
    const label =
      labels[group.key] ||
      (t ? t(getAdminNavGroupLabelKey(group.key) as any) : '') ||
      getAdminNavFallbackGroupLabel(group.key) ||
      '';

    return {
      id: group.id,
      label,
      items: group.items
        .filter((item) => {
          const allowed = item.roles ?? getAdminNavRoles(item.key);
          if (!allowed?.length) return role === 'admin';
          return allowed.includes(role);
        })
        .map((item) => {
          const title =
            items[item.key] ||
            (t ? t(getAdminNavTitleKey(item.key) as any) : '') ||
            (t ? t(getAdminLegacyNavTitleKey(item.key) as any) : '') ||
            getAdminNavFallbackTitle(item.key) ||
            item.key;

          return {
            title,
            url: item.url,
            icon: item.icon,
            comingSoon: item.comingSoon,
          };
        }),
    };
  }).filter((group) => group.items.length > 0);
}
