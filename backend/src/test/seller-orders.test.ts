// test/seller-orders.test.ts
import { describe, it, expect, afterAll } from 'bun:test';
import { getTestApp, closeTestApp, apiV1 } from './setup';

afterAll(closeTestApp);

describe('Satıcı sipariş API', () => {
  it('GET /seller/orders token olmadan 401', async () => {
    const app = await getTestApp();
    const res = await app.inject({
      method: 'GET',
      url: apiV1('/seller/orders'),
    });
    expect(res.statusCode).toBe(401);
  });

  it('GET /seller/orders/summary token olmadan 401', async () => {
    const app = await getTestApp();
    const res = await app.inject({
      method: 'GET',
      url: apiV1('/seller/orders/summary'),
    });
    expect(res.statusCode).toBe(401);
  });
});
