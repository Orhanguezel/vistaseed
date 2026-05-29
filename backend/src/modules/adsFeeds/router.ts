import type { FastifyInstance } from 'fastify';

import { getGoogleAdsPageFeed, getGoogleMerchantProductFeed } from './controller';

export async function registerAdsFeeds(api: FastifyInstance) {
  api.get('/ads/page-feed.csv', getGoogleAdsPageFeed);
  api.get('/ads/products-feed.tsv', getGoogleMerchantProductFeed);
}
