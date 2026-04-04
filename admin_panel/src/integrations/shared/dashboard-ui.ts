import type { AdminPermissionKey } from '@/navigation/permissions';
import { getAdminNavUrl } from '@/navigation/sidebar/sidebar-items';

export type DashboardModuleKey =
  | 'products'
  | 'categories'
  | 'contacts'
  | 'users'
  | 'site_settings';

export type DashboardModule = {
  key: DashboardModuleKey;
  href: string;
  permission?: AdminPermissionKey;
};

export const ADMIN_DASHBOARD_ROUTE_MAP: Record<string, string> = {
  products: getAdminNavUrl('products'),
  categories: getAdminNavUrl('categories'),
  contacts: getAdminNavUrl('contacts'),
  users: getAdminNavUrl('users'),
  site_settings: getAdminNavUrl('site_settings'),
  storage: getAdminNavUrl('storage'),
  theme: getAdminNavUrl('theme'),
  email_templates: getAdminNavUrl('email_templates'),
  telegram: getAdminNavUrl('telegram'),
  audit: getAdminNavUrl('audit'),
};

export const ADMIN_DASHBOARD_SUMMARY_PERMISSION_MAP: Partial<Record<string, AdminPermissionKey>> = {
  products: 'admin.products',
  contacts: 'admin.contacts',
};

export const ADMIN_DASHBOARD_MODULES: DashboardModule[] = [
  { key: 'products', href: getAdminNavUrl('products'), permission: 'admin.products' },
  { key: 'categories', href: getAdminNavUrl('categories'), permission: 'admin.categories' },
  { key: 'contacts', href: getAdminNavUrl('contacts'), permission: 'admin.contacts' },
  { key: 'users', href: getAdminNavUrl('users') },
  { key: 'site_settings', href: getAdminNavUrl('site_settings') },
];
