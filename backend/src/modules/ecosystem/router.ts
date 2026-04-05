import type { FastifyInstance } from 'fastify';
import { getContentFederation, ssoVerify } from './controller';

export async function registerEcosystem(api: FastifyInstance) {
  api.get('/ecosystem/content', getContentFederation);
  api.post('/ecosystem/sso-verify', ssoVerify);
}
