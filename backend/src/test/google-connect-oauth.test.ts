import { describe, expect, it } from 'bun:test';

import { handleRouteError, HttpRouteError } from '@agro/shared-backend/modules/_shared';

function routeErrorStatus(err: unknown): { status: number; message: string } {
  const result = { status: 0, message: '' };
  const reply = {
    sent: false,
    code(status: number) {
      result.status = status;
      return this;
    },
    send(body: { error?: { message?: string } }) {
      result.message = body.error?.message ?? '';
      this.sent = true;
      return body;
    },
  };
  const req = { log: { error() {} } };

  handleRouteError(
    reply as never,
    req as never,
    err,
    'google_connect_exchange_failed',
  );

  return result;
}

describe('Google Connect OAuth hata eşlemesi', () => {
  it('invalid_grant 400 döner', () => {
    expect(routeErrorStatus(new HttpRouteError('google_oauth: invalid_grant', 400))).toEqual({
      status: 400,
      message: 'google_oauth: invalid_grant',
    });
  });

  it('state mismatch 400 döner', () => {
    expect(routeErrorStatus(new Error('google_oauth_state_mismatch'))).toEqual({
      status: 400,
      message: 'google_oauth_state_mismatch',
    });
  });

  it('eksik OAuth client config 409 döner', () => {
    expect(routeErrorStatus(new Error('google_oauth_client_missing'))).toEqual({
      status: 409,
      message: 'google_oauth_client_missing',
    });
  });

  it('bilinmeyen hata 500 olarak kalır', () => {
    expect(routeErrorStatus(new Error('unexpected'))).toEqual({
      status: 500,
      message: 'google_connect_exchange_failed',
    });
  });
});
