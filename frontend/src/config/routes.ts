/**
 * Uygulama Route Sabitleri
 * Jenerik kurumsal site yapisi.
 */

export const ROUTES = {
  home: "/",

  products: {
    list:   "/urunler",
    detail: (slug: string) => `/urunler/${slug}`,
  },

  orders: {
    list:   "/panel/siparisler",
    detail: (id: string) => `/panel/siparisler/${id}`,
  },

  dealer: {
    dashboard:    "/bayi-dashboard",
    finance:      "/bayi/finans",
    profile:      "/bayi/profil",
    transactions: "/bayi/hareketler",
  },

  panel: {
    root:    "/panel",
    profile: "/panel/profil",
    /** Destek talepleri — panel icinde, ana siteye cikmadan */
    support: "/panel/destek",
  },

  static: {
    about:    "/hakkimizda",
    hr:       "/insan-kaynaklari",
    faq:      "/sss",
    contact:        "/iletisim",
    support:        "/destek",
    privacy:        "/gizlilik-politikasi",
    kvkk:           "/kvkk",
    terms:          "/kullanim-kosullari",
    dealer_login:   "/bayi-girisi",
    member_login:   "/uye-girisi",
    dealer_dashboard: "/bayi-dashboard",
    member_dashboard: "/uye-dashboard",
    rd_center:      "/arge-merkezi",
    planting_guide: "/ekim-rehberi",
    sustainability: "/surdurulebilirlik",
    knowledge_base: "/bilgi-bankasi",
    blog: "/blog",
    references: "/referanslar",
    compare: "/karsilastirma",
    dealer_network: "/bayi-agi",
    bulk_sales: "/toplu-satis",
  },
} as const;
