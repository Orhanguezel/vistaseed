export type PanelRole = 'admin' | 'seller';

export type AdminPermissionKey =
  | 'admin.dashboard'
  | 'admin.products'
  | 'admin.categories'
  | 'admin.custom_pages'
  | 'admin.gallery'
  | 'admin.references'
  | 'admin.library'
  | 'admin.support'
  | 'admin.job_listings'
  | 'admin.blog'
  | 'admin.job_applications'
  | 'admin.contacts'
  | 'admin.email_templates'
  | 'admin.offers'
  | 'admin.payment_attempts'
  | 'admin.users'
  | 'admin.site_settings'
  | 'admin.storage'
  | 'admin.theme'
  | 'admin.telegram'
  | 'admin.twitter'
  | 'admin.audit'
  | 'admin.db_admin'
  | 'admin.popups'
  | 'admin.home_layout'
  | 'admin.sliders'
  | 'admin.cache'
  | 'admin.homepage_content';

export type AdminNavKey =
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'custom_pages'
  | 'gallery'
  | 'references'
  | 'library'
  | 'support'
  | 'job_listings'
  | 'blog'
  | 'job_applications'
  | 'contacts'
  | 'email_templates'
  | 'offers'
  | 'payment_attempts'
  | 'users'
  | 'site_settings'
  | 'storage'
  | 'theme'
  | 'telegram'
  | 'twitter'
  | 'audit'
  | 'db_admin'
  | 'popups'
  | 'home_layout'
  | 'sliders'
  | 'cache'
  | 'homepage_content';

const ADMIN_ONLY: PanelRole[] = ['admin'];

const ADMIN_PERMISSION_ROLE_MAP: Record<AdminPermissionKey, PanelRole[]> = {
  'admin.dashboard': ADMIN_ONLY,
  'admin.products': ADMIN_ONLY,
  'admin.categories': ADMIN_ONLY,
  'admin.custom_pages': ADMIN_ONLY,
  'admin.gallery': ADMIN_ONLY,
  'admin.references': ADMIN_ONLY,
  'admin.library': ADMIN_ONLY,
  'admin.support': ADMIN_ONLY,
  'admin.job_listings': ADMIN_ONLY,
  'admin.blog': ADMIN_ONLY,
  'admin.job_applications': ADMIN_ONLY,
  'admin.contacts': ADMIN_ONLY,
  'admin.email_templates': ADMIN_ONLY,
  'admin.offers': ADMIN_ONLY,
  'admin.payment_attempts': ADMIN_ONLY,
  'admin.users': ADMIN_ONLY,
  'admin.site_settings': ADMIN_ONLY,
  'admin.storage': ADMIN_ONLY,
  'admin.theme': ADMIN_ONLY,
  'admin.telegram': ADMIN_ONLY,
  'admin.twitter': ADMIN_ONLY,
  'admin.audit': ADMIN_ONLY,
  'admin.db_admin': ADMIN_ONLY,
  'admin.popups': ADMIN_ONLY,
  'admin.home_layout': ADMIN_ONLY,
  'admin.sliders': ADMIN_ONLY,
  'admin.cache': ADMIN_ONLY,
  'admin.homepage_content': ADMIN_ONLY,
};

export function canAccessAdminPermission(role: PanelRole, key: AdminPermissionKey): boolean {
  const allowed = ADMIN_PERMISSION_ROLE_MAP[key] ?? ADMIN_ONLY;
  return allowed.includes(role);
}

const ADMIN_NAV_PERMISSION_MAP: Partial<Record<AdminNavKey, AdminPermissionKey>> = {
  dashboard: 'admin.dashboard',
  products: 'admin.products',
  categories: 'admin.categories',
  custom_pages: 'admin.custom_pages',
  gallery: 'admin.gallery',
  references: 'admin.references',
  library: 'admin.library',
  support: 'admin.support',
  job_listings: 'admin.job_listings',
  blog: 'admin.blog',
  job_applications: 'admin.job_applications',
  contacts: 'admin.contacts',
  email_templates: 'admin.email_templates',
  offers: 'admin.offers',
  payment_attempts: 'admin.payment_attempts',
  users: 'admin.users',
  site_settings: 'admin.site_settings',
  storage: 'admin.storage',
  theme: 'admin.theme',
  telegram: 'admin.telegram',
  twitter: 'admin.twitter',
  audit: 'admin.audit',
  db_admin: 'admin.db_admin',
  popups: 'admin.popups',
  home_layout: 'admin.home_layout',
  sliders: 'admin.sliders',
  cache: 'admin.cache',
  homepage_content: 'admin.homepage_content',
};

export function getAdminNavRoles(key: AdminNavKey): PanelRole[] {
  const permissionKey = ADMIN_NAV_PERMISSION_MAP[key];
  if (!permissionKey) return ADMIN_ONLY;
  return ADMIN_PERMISSION_ROLE_MAP[permissionKey] ?? ADMIN_ONLY;
}

const ADMIN_PERMISSION_PATHS: Record<AdminPermissionKey, string[]> = {
  'admin.dashboard': ['/admin/dashboard'],
  'admin.products': ['/admin/products'],
  'admin.categories': ['/admin/categories'],
  'admin.custom_pages': ['/admin/custom-pages'],
  'admin.gallery': ['/admin/gallery'],
  'admin.references': ['/admin/references'],
  'admin.library': ['/admin/library'],
  'admin.support': ['/admin/support'],
  'admin.job_listings': ['/admin/job-listings'],
  'admin.blog': ['/admin/blog'],
  'admin.job_applications': ['/admin/job-applications'],
  'admin.contacts': ['/admin/contacts'],
  'admin.email_templates': ['/admin/email-templates'],
  'admin.offers': ['/admin/offers'],
  'admin.payment_attempts': ['/admin/payment-attempts'],
  'admin.users': ['/admin/users'],
  'admin.site_settings': ['/admin/site-settings'],
  'admin.storage': ['/admin/storage'],
  'admin.theme': ['/admin/theme'],
  'admin.telegram': ['/admin/telegram'],
  'admin.twitter': ['/admin/twitter'],
  'admin.audit': ['/admin/audit'],
  'admin.db_admin': ['/admin/db-admin'],
  'admin.popups': ['/admin/popups'],
  'admin.home_layout': ['/admin/home-layout'],
  'admin.sliders': ['/admin/sliders'],
  'admin.cache': ['/admin/cache'],
  'admin.homepage_content': ['/admin/homepage-content'],
};

function stripQueryAndHash(pathname: string): string {
  const [noHash] = pathname.split('#', 1);
  const [clean] = (noHash ?? pathname).split('?', 1);
  return clean || '/';
}

function matchesPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function canAccessAdminPath(role: PanelRole, pathname: string): boolean {
  if (role === 'admin') return true;
  const clean = stripQueryAndHash(pathname);

  return (Object.keys(ADMIN_PERMISSION_PATHS) as AdminPermissionKey[]).some((permissionKey) => {
    if (!canAccessAdminPermission(role, permissionKey)) return false;
    const prefixes = ADMIN_PERMISSION_PATHS[permissionKey] ?? [];
    return prefixes.some((prefix) => matchesPrefix(clean, prefix));
  });
}
