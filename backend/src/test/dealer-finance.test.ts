// test/dealer-finance.test.ts
import { describe, it, expect, afterAll } from 'bun:test';
import { getTestApp, closeTestApp, apiV1 } from './setup';

afterAll(closeTestApp);

describe('Dealer finance — özet endpoint', () => {
  it('GET /dealer/finance/summary token olmadan 401 döner', async () => {
    const app = await getTestApp();
    const res = await app.inject({
      method: 'GET',
      url: apiV1('/dealer/finance/summary'),
    });
    expect(res.statusCode).toBe(401);
  });
});
