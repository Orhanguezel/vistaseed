import type { FastifyInstance } from "fastify";

import { adminListPaymentAttempts } from "./admin.controller";

export async function registerPaymentAttemptsAdmin(app: FastifyInstance) {
  app.get("/payment-attempts", adminListPaymentAttempts);
}
