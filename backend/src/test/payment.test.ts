import { afterAll, describe, expect, it, mock } from "bun:test";

mock.module("pdfkit", () => ({
  default: class PDFDocumentMock {
    pipe() {
      return this;
    }
    fontSize() {
      return this;
    }
    text() {
      return this;
    }
    moveDown() {
      return this;
    }
    end() {
      return this;
    }
  },
}));

async function loadSetup() {
  return import("./setup");
}

async function createAdminToken() {
  const { getTestApp } = await loadSetup();
  const app = await getTestApp();
  return {
    app,
    token: app.jwt.sign({
      sub: "payment-test-admin",
      email: "payment-test-admin@vistaseeds.local",
      role: "admin",
      roles: ["admin"],
      is_admin: true,
    }),
  };
}

describe("Payment routes", () => {
  it("POST /orders/:id/payment/card/initiate token olmadan 401 doner", async () => {
    const { getTestApp, apiV1 } = await loadSetup();
    const app = await getTestApp();
    const res = await app.inject({
      method: "POST",
      url: apiV1("/orders/test-order-id/payment/card/initiate"),
    });
    expect(res.statusCode).toBe(401);
  }, 20000);

  it("POST /orders/:id/payment/iyzico/initiate token olmadan 401 doner", async () => {
    const { getTestApp, apiV1 } = await loadSetup();
    const app = await getTestApp();
    const res = await app.inject({
      method: "POST",
      url: apiV1("/orders/test-order-id/payment/iyzico/initiate"),
    });
    expect(res.statusCode).toBe(401);
  }, 20000);

  it("POST /orders/:id/payment/bank-transfer token olmadan 401 doner", async () => {
    const { getTestApp, apiV1 } = await loadSetup();
    const app = await getTestApp();
    const res = await app.inject({
      method: "POST",
      url: apiV1("/orders/test-order-id/payment/bank-transfer"),
    });
    expect(res.statusCode).toBe(401);
  }, 20000);

  it("POST /orders/:id/payment/credit token olmadan 401 doner", async () => {
    const { getTestApp, apiV1 } = await loadSetup();
    const app = await getTestApp();
    const res = await app.inject({
      method: "POST",
      url: apiV1("/orders/test-order-id/payment/credit"),
    });
    expect(res.statusCode).toBe(401);
  }, 20000);
});

describe("Payment attempts admin routes", () => {
  it("GET /admin/payment-attempts token olmadan 401 doner", async () => {
    const { getTestApp, apiAdmin } = await loadSetup();
    const app = await getTestApp();
    const res = await app.inject({
      method: "GET",
      url: apiAdmin("/payment-attempts"),
    });
    expect(res.statusCode).toBe(401);
  }, 20000);

  it("GET /admin/payment-attempts admin ile 200 ve liste payload'i doner", async () => {
    const { apiAdmin, authHeaders } = await loadSetup();
    const { app, token } = await createAdminToken();

    const res = await app.inject({
      method: "GET",
      url: apiAdmin("/payment-attempts"),
      headers: authHeaders(token),
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(Array.isArray(body.data)).toBe(true);
    expect(typeof body.total).toBe("number");
  }, 20000);

  it("GET /admin/orders/payment-attempts shared admin endpoint'i admin ile 200 doner", async () => {
    const { apiAdmin, authHeaders } = await loadSetup();
    const { app, token } = await createAdminToken();

    const res = await app.inject({
      method: "GET",
      url: apiAdmin("/orders/payment-attempts"),
      headers: authHeaders(token),
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(Array.isArray(body.data)).toBe(true);
    expect(typeof body.total).toBe("number");
  }, 20000);
});

afterAll(async () => {
  const { closeTestApp } = await loadSetup();
  await closeTestApp();
});
