// test/setup.ts — Test altyapisi: Fastify app + yardimci fonksiyonlar
import { createApp } from "@/app";
import type { FastifyInstance } from "fastify";

let _app: FastifyInstance | null = null;
const API_V1_PREFIX = "/api/v1";

/** Singleton test app — tum testler ayni instance'i kullanir */
export async function getTestApp(): Promise<FastifyInstance> {
  if (_app) return _app;
  _app = await createApp() as unknown as FastifyInstance;
  await _app.ready();
  return _app;
}

export async function closeTestApp() {
  if (_app) {
    await _app.close();
    _app = null;
  }
}

/** Kayit ol + access_token don */
export async function registerUser(
  app: FastifyInstance,
  data: { email: string; password: string; full_name?: string; role?: string },
) {
  const res = await app.inject({
    method: "POST",
    url: apiV1("/auth/signup"),
    payload: {
      email: data.email,
      password: data.password,
      full_name: data.full_name ?? "Test User",
      phone: "05551234567",
      rules_accepted: true,
      ...(data.role ? { options: { data: { role: data.role } } } : {}),
    },
  });
  const body = JSON.parse(res.body);
  return { status: res.statusCode, body, token: body.access_token as string | undefined };
}

/** Giris yap + access_token don */
export async function loginUser(
  app: FastifyInstance,
  email: string,
  password: string,
) {
  const res = await app.inject({
    method: "POST",
    url: apiV1("/auth/token"),
    payload: { email, password },
  });
  const body = JSON.parse(res.body);
  return { status: res.statusCode, body, token: body.access_token as string | undefined };
}

export async function registerAdminUser(
  app: FastifyInstance,
  data?: { email?: string; password?: string; full_name?: string },
) {
  const email = data?.email ?? randomEmail();
  const password = data?.password ?? "Test1234!";
  const full_name = data?.full_name ?? "Admin User";
  const signup = await registerUser(app, { email, password, full_name });
  const userId = signup.body?.user?.id as string | undefined;
  const login = await loginUser(app, email, password);
  return { ...login, email, password, userId };
}

/** Auth header'li inject helper */
export function authHeaders(token: string) {
  return { authorization: `Bearer ${token}` };
}

export function apiV1(path: string) {
  return `${API_V1_PREFIX}${path.startsWith("/") ? path : `/${path}`}`;
}

export function apiAdmin(path: string) {
  return apiV1(`/admin${path.startsWith("/") ? path : `/${path}`}`);
}

/** Rastgele email olustur */
export function randomEmail() {
  return `test_${Date.now()}_${Math.random().toString(36).slice(2, 8)}@test.com`;
}
