import type { FastifyInstance } from 'fastify';
import { authSecurity, fromZodSchema } from '../_shared';
import {
  passwordResetConfirmBody,
  passwordResetRequestBody,
  signupBody,
  tokenBody,
  updateBody,
} from './validation';
import { signup, token, refresh, passwordResetRequest, passwordResetConfirm, me, status, update, logout } from './controller';

export async function registerAuth(app: FastifyInstance) {
  const B = '/auth';

  app.post(`${B}/signup`, {
    config: { rateLimit: { max: 20, timeWindow: '1 minute' } },
    schema: { tags: ['auth'], body: fromZodSchema(signupBody, 'SignupBody') },
  }, signup);
  app.post(`${B}/register`, {
    config: { rateLimit: { max: 20, timeWindow: '1 minute' } },
    schema: { tags: ['auth'], body: fromZodSchema(signupBody, 'SignupBody') },
  }, signup);
  app.post(`${B}/token`, {
    config: { rateLimit: { max: 30, timeWindow: '1 minute' } },
    schema: { tags: ['auth'], body: fromZodSchema(tokenBody, 'TokenBody') },
  }, token);
  app.post(`${B}/login`, {
    config: { rateLimit: { max: 30, timeWindow: '1 minute' } },
    schema: { tags: ['auth'], body: fromZodSchema(tokenBody, 'TokenBody') },
  }, token);
  app.post(`${B}/token/refresh`, {
    config: { rateLimit: { max: 60, timeWindow: '1 minute' } },
    schema: { tags: ['auth'] },
  }, refresh);
  app.post(`${B}/password-reset/request`, {
    config: { rateLimit: { max: 10, timeWindow: '1 minute' } },
    schema: { tags: ['auth'], body: fromZodSchema(passwordResetRequestBody, 'PasswordResetRequestBody') },
  }, passwordResetRequest);
  app.post(`${B}/password-reset/confirm`, {
    config: { rateLimit: { max: 20, timeWindow: '1 minute' } },
    schema: { tags: ['auth'], body: fromZodSchema(passwordResetConfirmBody, 'PasswordResetConfirmBody') },
  }, passwordResetConfirm);

  app.get(`${B}/user`, {
    schema: { tags: ['auth'], security: authSecurity },
  }, me);
  app.get(`${B}/status`, {
    schema: { tags: ['auth'] },
  }, status);
  app.put(`${B}/user`, {
    schema: { tags: ['auth'], security: authSecurity, body: fromZodSchema(updateBody, 'AuthUpdateBody') },
  }, update);
  app.post(`${B}/logout`, {
    schema: { tags: ['auth'], security: authSecurity },
  }, logout);
}
