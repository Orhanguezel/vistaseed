// test/admin-dealer-finance-batch.test.ts
import { describe, it, expect, afterAll } from 'bun:test';
import { getTestApp, closeTestApp, apiAdmin } from './setup';

afterAll(closeTestApp);

describe('Admin — toplu cari uyarı', () => {
  it('POST /admin/dealers/finance/run-alerts token olmadan 401', async () => {
    const app = await getTestApp();
    const res = await app.inject({
      method: 'POST',
      url: apiAdmin('/dealers/finance/run-alerts'),
    });
    expect(res.statusCode).toBe(401);
  });
});
