'use client';

import * as React from 'react';

import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { AdminLocaleSelect } from '@/components/common/admin-locale-select';
import { useAdminLocales } from '@/components/common/use-admin-locales';

import HeroEditor from './hero-editor';
import TrustBadgesEditor from './trust-badges-editor';
import HomepageSectionsEditor from './homepage-sections-editor';
import FeaturePanelsEditor from './feature-panels-editor';
import PlantingGuideEditor from './planting-guide-editor';
import NewsletterEditor from './newsletter-editor';

export default function HomepageContentClient() {
  const t = useAdminT('admin.homepage-content');
  const { localeOptions, defaultLocaleFromDb, coerceLocale } = useAdminLocales();

  const [locale, setLocale] = React.useState('');
  React.useEffect(() => {
    setLocale((prev) => coerceLocale(prev, defaultLocaleFromDb || 'tr'));
  }, [coerceLocale, defaultLocaleFromDb]);

  if (!locale) {
    return <div className="text-sm text-muted-foreground p-4">{t('messages.loading')}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-lg font-semibold">{t('title')}</h1>
          <p className="text-sm text-muted-foreground">{t('description')}</p>
        </div>
        <AdminLocaleSelect
          value={locale}
          onChange={setLocale}
          options={localeOptions}
          className="w-32"
        />
      </div>

      <HeroEditor locale={locale} />
      <TrustBadgesEditor locale={locale} />
      <HomepageSectionsEditor locale={locale} />
      <FeaturePanelsEditor locale={locale} />
      <PlantingGuideEditor locale={locale} />
      <NewsletterEditor locale={locale} />
    </div>
  );
}
