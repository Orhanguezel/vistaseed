// test/api.test.ts — Genel API endpoint testleri
import { describe, it, expect, afterAll } from "bun:test";
import { getTestApp, closeTestApp, registerUser, randomEmail, authHeaders, apiV1 } from "./setup";

afterAll(closeTestApp);

describe("Health", () => {
  it("GET /api/health 200 doner", async () => {
    const app = await getTestApp();
    const res = await app.inject({ method: "GET", url: "/api/health" });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toMatchObject({ ok: true });
  });
});

describe("Notifications", () => {
  it("auth ile bildirim listesi doner", async () => {
    const app = await getTestApp();
    const email = randomEmail();
    const { token } = await registerUser(app, { email, password: "Test1234!" });

    const res = await app.inject({
      method: "GET",
      url: apiV1("/notifications"),
      headers: authHeaders(token!),
    });
    expect(res.statusCode).toBe(200);
  });

  it("unread-count doner", async () => {
    const app = await getTestApp();
    const email = randomEmail();
    const { token } = await registerUser(app, { email, password: "Test1234!" });

    const res = await app.inject({
      method: "GET",
      url: apiV1("/notifications/unread-count"),
      headers: authHeaders(token!),
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.count).toBeDefined();
  });
});

describe("Profiles", () => {
  it("profil bilgisi doner", async () => {
    const app = await getTestApp();
    const email = randomEmail();
    const { token } = await registerUser(app, { email, password: "Test1234!", full_name: "Test Kullanici" });

    const res = await app.inject({
      method: "GET",
      url: apiV1("/profiles/me"),
      headers: authHeaders(token!),
    });
    expect(res.statusCode).toBe(200);
  });

  it("profil guncellenir", async () => {
    const app = await getTestApp();
    const email = randomEmail();
    const { token } = await registerUser(app, { email, password: "Test1234!" });

    const res = await app.inject({
      method: "PUT",
      url: apiV1("/profiles/me"),
      headers: authHeaders(token!),
      payload: { full_name: "Yeni Isim", phone: "05559876543" },
    });
    expect(res.statusCode).toBe(200);
  });
});
