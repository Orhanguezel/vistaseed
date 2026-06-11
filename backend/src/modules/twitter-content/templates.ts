// src/modules/twitter-content/templates.ts
// Şablon tanımları + AI prompt konuları (sosyal platformdaki vistaseeds-x portu)

import type { TwitterCalendarEvent } from './calendar';
import type { TwitterProduct } from './repository';

export enum TwitterTemplate {
  InteractionPoll = 'interaction_poll',
  InteractionQuestion = 'interaction_question',
  VarietyPromo = 'variety_promo',
  HumanResearch = 'human_research',
  FieldProof = 'field_proof',
  SeedMyth = 'seed_myth',
  ExportVision = 'export_vision',
  IndustryEvent = 'industry_event',
  NationalDay = 'national_day',
  LocalSeedValue = 'local_seed_value',
  AgronomyTip = 'agronomy_tip',
}

export interface TwitterTemplateSlot {
  key: string;
  dayOfWeek: 3 | 4 | 5;
  hour: number;
  minute: number;
  template: TwitterTemplate;
  pillar: string;
  topic: string;
  preferredProduct?: string;
}

export interface TwitterTweetContext {
  product?: TwitterProduct | null;
  event?: TwitterCalendarEvent | null;
  linkUrl: string;
  strategySlotKey?: string;
  strategyTopic?: string;
}

export const TWITTER_SLOTS: TwitterTemplateSlot[] = [
  { key: '01-export-manifesto', dayOfWeek: 3, hour: 17, minute: 0, template: TwitterTemplate.ExportVision, pillar: 'İhracat/yerli gurur', topic: 'Açılış/manifesto' },
  { key: '02-kapya-charliston-poll', dayOfWeek: 4, hour: 17, minute: 0, template: TwitterTemplate.InteractionPoll, pillar: 'Etkileşim', topic: 'Kapya mı charliston mu?' },
  { key: '03-cankan-f1', dayOfWeek: 5, hour: 17, minute: 0, template: TwitterTemplate.VarietyPromo, pillar: 'Çeşit kartı', topic: 'Cankan F1 kırmızı kapya', preferredProduct: 'Cankan' },
  { key: '04-lab-research', dayOfWeek: 3, hour: 17, minute: 0, template: TwitterTemplate.HumanResearch, pillar: 'İnsan/Ar-Ge', topic: 'Lab ve ıslah perde arkası' },
  { key: '05-season-challenge-question', dayOfWeek: 4, hour: 17, minute: 0, template: TwitterTemplate.InteractionQuestion, pillar: 'Etkileşim', topic: 'Bu sezon en çok hangi sorun zorladı?' },
  { key: '06-tirpan-f1', dayOfWeek: 5, hour: 17, minute: 0, template: TwitterTemplate.VarietyPromo, pillar: 'Çeşit kartı', topic: 'Tırpan F1 kapya', preferredProduct: 'Tırpan' },
  { key: '07-field-proof', dayOfWeek: 3, hour: 17, minute: 0, template: TwitterTemplate.FieldProof, pillar: 'Saha kanıtı', topic: 'Tarlada güçlü çıkış' },
  { key: '08-certified-seed-myth', dayOfWeek: 4, hour: 17, minute: 0, template: TwitterTemplate.SeedMyth, pillar: 'Bilgi/efsane-yıkma', topic: 'Sertifikalı tohum neden önemli?' },
  { key: '09-birlik-f1', dayOfWeek: 5, hour: 17, minute: 0, template: TwitterTemplate.VarietyPromo, pillar: 'Çeşit kartı', topic: 'Birlik F1 üçburun', preferredProduct: 'Birlik' },
  { key: '10-breeding-story', dayOfWeek: 3, hour: 17, minute: 0, template: TwitterTemplate.HumanResearch, pillar: 'İnsan/Ar-Ge', topic: 'Bir çeşidin ıslah hikayesi' },
  { key: '11-tomato-poll', dayOfWeek: 4, hour: 17, minute: 0, template: TwitterTemplate.InteractionPoll, pillar: 'Etkileşim', topic: 'Domateste tat mı raf ömrü mü?' },
  { key: '12-export-vision', dayOfWeek: 5, hour: 17, minute: 0, template: TwitterTemplate.ExportVision, pillar: 'İhracat/vizyon', topic: 'Türk tohumunu dünyaya taşıma hedefi' },
  { key: '13-lucky-f1', dayOfWeek: 3, hour: 17, minute: 0, template: TwitterTemplate.VarietyPromo, pillar: 'Çeşit kartı', topic: 'Lucky F1 charliston', preferredProduct: 'Lucky' },
  { key: '14-grower-proof', dayOfWeek: 4, hour: 17, minute: 0, template: TwitterTemplate.FieldProof, pillar: 'Saha kanıtı', topic: 'Üretici görüşü / kısa video' },
  { key: '15-saray-f1', dayOfWeek: 5, hour: 17, minute: 0, template: TwitterTemplate.VarietyPromo, pillar: 'Çeşit kartı', topic: 'Saray F1 dolmalık', preferredProduct: 'Saray' },
];

const TEMPLATE_WEIGHTS: Record<TwitterTemplate, number> = {
  [TwitterTemplate.InteractionPoll]: 25,
  [TwitterTemplate.InteractionQuestion]: 25,
  [TwitterTemplate.VarietyPromo]: 40,
  [TwitterTemplate.HumanResearch]: 20,
  [TwitterTemplate.FieldProof]: 15,
  [TwitterTemplate.SeedMyth]: 25,
  [TwitterTemplate.ExportVision]: 15,
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

  if (template === TwitterTemplate.InteractionPoll) {
    return [
      'Sablon: Etkilesim / anket.',
      'Kisa bir soru sor; yorum istemeyi unutma.',
      'Hashtag az kullanilacak, hashtag yazma.',
      ...rules,
    ].join('\n');
  }
  if (template === TwitterTemplate.InteractionQuestion) {
    return [
      'Sablon: Etkilesim / uretici sorusu.',
      'Ureticinin deneyimini sor, birlikte cozum hissi ver.',
      'Hashtag az kullanilacak, hashtag yazma.',
      ...rules,
    ].join('\n');
  }
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
  if (template === TwitterTemplate.HumanResearch) {
    return [
      'Sablon: Insan / Ar-Ge perde arkasi.',
      'Laboratuvar, islah ve deneme emegini anlat.',
      'Kesin sure veya resmi iddia uydurma.',
      ...rules,
    ].join('\n');
  }
  if (template === TwitterTemplate.FieldProof) {
    return [
      'Sablon: Saha kaniti.',
      'Tarla, homojen gelisim ve uretici gozlemini sade anlat.',
      'Mevki, tarih veya verim bilgisi uydurma.',
      ...rules,
    ].join('\n');
  }
  if (template === TwitterTemplate.SeedMyth) {
    return [
      'Sablon: Bilgi / efsane yikma.',
      'Sertifikali tohumun neden onemli oldugunu anlat.',
      'Garanti, kesin verim veya oran verme.',
      ...rules,
    ].join('\n');
  }
  if (template === TwitterTemplate.ExportVision) {
    return [
      'Sablon: Ihracat / vizyon.',
      'Yerli islahi dunyaya tasima hedefini abartisiz anlat.',
      'Gerceklesmemis ulke, fuar veya satis iddiasi uydurma.',
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
