// src/modules/twitter-content/templates.ts
// Şablon tanımları + AI prompt konuları (sosyal platformdaki vistaseeds-x portu)

import type { TwitterCalendarEvent } from './calendar';
import type { TwitterProduct } from './repository';

export enum TwitterTemplate {
  VarietyPromo = 'variety_promo',
  IndustryEvent = 'industry_event',
  NationalDay = 'national_day',
  LocalSeedValue = 'local_seed_value',
  AgronomyTip = 'agronomy_tip',
}

export interface TwitterTemplateSlot {
  key: 'variety' | 'event' | 'afternoon';
  hour: number;
  minute: number;
  templates: TwitterTemplate[];
}

export interface TwitterTweetContext {
  product?: TwitterProduct | null;
  event?: TwitterCalendarEvent | null;
  linkUrl: string;
}

export const TWITTER_SLOTS: TwitterTemplateSlot[] = [
  { key: 'variety', hour: 10, minute: 0, templates: [TwitterTemplate.VarietyPromo] },
  { key: 'event', hour: 11, minute: 0, templates: [TwitterTemplate.IndustryEvent, TwitterTemplate.NationalDay] },
  { key: 'afternoon', hour: 16, minute: 0, templates: [TwitterTemplate.LocalSeedValue, TwitterTemplate.AgronomyTip] },
];

const TEMPLATE_WEIGHTS: Record<TwitterTemplate, number> = {
  [TwitterTemplate.VarietyPromo]: 40,
  [TwitterTemplate.IndustryEvent]: 15,
  [TwitterTemplate.NationalDay]: 15,
  [TwitterTemplate.LocalSeedValue]: 15,
  [TwitterTemplate.AgronomyTip]: 15,
};

export function chooseTwitterTemplate(
  candidates: TwitterTemplate[],
  random = Math.random,
): TwitterTemplate {
  if (candidates.length === 0) throw new Error('twitter_template_candidates_empty');
  if (candidates.length === 1) return candidates[0]!;
  const total = candidates.reduce((sum, template) => sum + TEMPLATE_WEIGHTS[template], 0);
  let pick = random() * total;
  for (const template of candidates) {
    pick -= TEMPLATE_WEIGHTS[template];
    if (pick <= 0) return template;
  }
  return candidates[candidates.length - 1]!;
}

export function compactDescription(product?: TwitterProduct | null) {
  return (product?.description || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 700);
}

/** AI üretimi için konu/prompt metni. Kurallar uydurmayı engeller. */
export function buildTweetTopic(template: TwitterTemplate, ctx: TwitterTweetContext): string {
  const product = ctx.product;
  const productLines = [
    product ? `Urun: ${product.title}` : '',
    product
      ? `Katalog aciklamasi: ${compactDescription(product) || 'Aciklama yok; sadece urun adina sadik kal.'}`
      : '',
    `Link: ${ctx.linkUrl}`,
  ].filter(Boolean);
  const rules = [
    'Kurallar:',
    "- Tek X/Twitter tweet'i yaz; 280 karakteri asma.",
    '- Hashtag yazma; sistem kuralli olarak ekleyecek.',
    '- Turkce yaz.',
    '- Urun ozelligi uydurma, katalogda olmayan tolerans/verim/raf omru iddiasi ekleme.',
    "- Istatistik, oran veya yuzde UYDURMA; kaynaksiz sayi verme.",
    '- Placeholder URL veya yabanci dil kullanma.',
  ];

  if (template === TwitterTemplate.VarietyPromo) {
    return [
      'Sablon: Cesit Tanitimi.',
      'Format: cesit adi + Bitki/Meyve bilgisi + kisa CTA.',
      "Metinde mumkunse su basliklari kullan: 'Bitki:' ve 'Meyve:'.",
      ...productLines,
      ...rules,
    ].join('\n');
  }
  if (template === TwitterTemplate.IndustryEvent) {
    return [
      'Sablon: Sektor/Fuar.',
      `Etkinlik: ${ctx.event?.title || 'tohum sektoru gundemi'}`,
      'Sektor otoritesi ve yerli tohum temsili vurgusu yap; katilim/stand iddiasi uydurma.',
      ...rules,
    ].join('\n');
  }
  if (template === TwitterTemplate.NationalDay) {
    return [
      'Sablon: Milli Gun.',
      `Gun: ${ctx.event?.title || 'milli gun'}`,
      'Saygili, sade ve tarima emek verenleri anan bir kutlama yaz.',
      ...rules,
    ].join('\n');
  }
  if (template === TwitterTemplate.AgronomyTip) {
    return [
      'Sablon: Agronomi ipucu.',
      'Biber yetistiriciliginde uygulanabilir, abartisiz ve genel bir ipucu ver.',
      product ? `Baglam urunu: ${product.title}` : 'Baglam: biber ve sebze tohumu.',
      ...rules,
    ].join('\n');
  }
  return [
    'Sablon: Yerli Tohum / Deger.',
    'Yerli tohum, ureticiye guven ve islaha dayali marka degeri anlat.',
    'Abartili garanti, kesin verim veya resmi sertifika iddiasi kurma.',
    ...rules,
  ].join('\n');
}
