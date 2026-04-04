import type { FastifyInstance } from "fastify";
import {
  adminExportSql,
  adminImportSqlText,
  adminImportSqlFromUrl,
  adminImportSqlFromFile,
  adminListDbSnapshots,
  adminCreateDbSnapshot,
  adminRestoreDbSnapshot,
  adminDeleteDbSnapshot,
} from "./admin.controller";
import {
  adminExportModuleSql,
  adminImportModuleSql,
  adminExportSiteSettingsUiJson,
  adminBootstrapSiteSettingsUiLocale,
} from "./moduleExportImport.controller";
import { adminValidateModuleManifest } from "./moduleValidation.controller";

export async function registerDbAdmin(app: FastifyInstance) {
  const B = "/db";

  // Full DB
  app.get(`${B}/export`, adminExportSql);
  app.post(`${B}/import-sql`, adminImportSqlText);
  app.post(`${B}/import-url`, adminImportSqlFromUrl);
  app.post(`${B}/import-file`, adminImportSqlFromFile);

  // Module export/import
  app.get(`${B}/export-module`, adminExportModuleSql);
  app.post(`${B}/import-module`, adminImportModuleSql);

  // Site settings bulk UI ops
  app.get(`${B}/site-settings/ui-export`, adminExportSiteSettingsUiJson);
  app.post(`${B}/site-settings/ui-bootstrap`, adminBootstrapSiteSettingsUiLocale);

  // Manifest validation
  app.get(`${B}/modules/validate`, adminValidateModuleManifest);

  // Snapshots
  app.get(`${B}/snapshots`, adminListDbSnapshots);
  app.post(`${B}/snapshots`, adminCreateDbSnapshot);
  app.post(`${B}/snapshots/:id/restore`, adminRestoreDbSnapshot);
  app.delete(`${B}/snapshots/:id`, adminDeleteDbSnapshot);
}
