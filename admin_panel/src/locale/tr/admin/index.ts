import audit from "./audit.json";
import auth from "./auth.json";
import blog from "./blog.json";
import categories from "./categories.json";
import comingSoon from "./coming-soon.json";
import common from "./common.json";
import contacts from "./contacts.json";
import customPages from "./custom-pages.json";
import dashboard from "./dashboard.json";
import db from "./db.json";
import emailTemplates from "./email-templates.json";
import faqs from "./faqs.json";
import gallery from "./gallery.json";
import jobApplications from "./job-applications.json";
import jobListings from "./job-listings.json";
import library from "./library.json";
import mail from "./mail.json";
import notifications from "./notifications.json";
import offers from "./offers.json";
import popups from "./popups.json";
import products from "./products.json";
import references from "./references.json";
import sidebar from "./sidebar.json";
import siteSettings from "./site-settings.json";
import storage from "./storage.json";
import support from "./support.json";
import telegram from "./telegram.json";
import theme from "./theme.json";
import userRoles from "./user-roles.json";
import users from "./users.json";

const adminMessages = {
  audit: audit,
  auth: auth,
  blog: blog,
  categories: categories,
  comingSoon: comingSoon,
  common: common,
  contacts: contacts,
  "custom-pages": customPages,
  dashboard: dashboard,
  db: db,
  emailTemplates: emailTemplates,
  faqs: faqs,
  gallery: gallery,
  "job-applications": jobApplications,
  "job-listings": jobListings,
  library: library,
  mail: mail,
  notifications: notifications,
  offers: offers,
  popups: popups,
  products: products,
  references: references,
  sidebar: sidebar,
  siteSettings: siteSettings,
  support: support,
  storage: storage,
  telegram: telegram,
  theme: theme,
  userRoles: userRoles,
  users: users,
} as const;

export default adminMessages;
