import type { FastifyInstance } from "fastify";

import { adminDashboardSummary } from "./admin.controller";

export async function registerDashboardAdmin(app: FastifyInstance) {
  app.get("/dashboard/summary", adminDashboardSummary);
}
