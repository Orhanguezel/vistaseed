// test/dealer-finance-alerts.test.ts
import { describe, it, expect, afterAll } from 'bun:test';
import { getTestApp, closeTestApp, apiV1 } from './setup';

afterAll(closeTestApp);

describe('Dealer finance — uyarı ve PDF', () => {
  it('POST /dealer/finance/send-alerts token olmadan 401', async () => {
    const app = await getTestApp();
    const res = await app.inject({
      method: 'POST',
      url: apiV1('/dealer/finance/send-alerts'),
    });
    expect(res.statusCode).toBe(401);
  });

  it('GET /dealer/finance/statement.pdf token olmadan 401', async () => {
    const app = await getTestApp();
    const res = await app.inject({
      method: 'GET',
      url: apiV1('/dealer/finance/statement.pdf'),
    });
    expect(res.statusCode).toBe(401);
  });
});
