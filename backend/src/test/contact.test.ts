// test/contact.test.ts — İletişim formu testleri
import { describe, it, expect, afterAll } from "bun:test";
import { getTestApp, closeTestApp, apiV1 } from "./setup";

afterAll(closeTestApp);

describe("Contact — İletişim Formu", () => {
  it("herkese açık iletişim formu gönderilebilir", async () => {
    const app = await getTestApp();
    const res = await app.inject({
      method: "POST",
      url: apiV1("/contacts"),
      payload: {
        name: "Test User",
        email: "test@example.com",
        phone: "05551234567",
        subject: "Test Konu",
        message: "Bu bir test mesajıdır.",
      },
    });
    
    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body.id).toBeDefined();
    expect(body.email).toBe("test@example.com");
  });

  it("geçersiz email ile hata döner", async () => {
    const app = await getTestApp();
    const res = await app.inject({
      method: "POST",
      url: apiV1("/contacts"),
      payload: {
        name: "Test",
        email: "invalid-email",
        phone: "05551234567",
        message: "Mesaj",
      },
    });
    
    expect(res.statusCode).toBe(400);
  });
});
