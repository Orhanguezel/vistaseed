// src/modules/twitter-content/fallbacks.ts
// Deterministik tweet şablonları (AI kapalı/başarısızsa ana yol budur)

import { TwitterTemplate, type TwitterTweetContext, compactDescription } from './templates';

const AGRONOMY_TIPS = [
  '🫑 Biberde saglikli gelisim icin sulama dengesini koruyun; ani su stresi cicek ve meyve tutumunu zorlayabilir.',
  '🌱 Fide dikiminden once topragi havalandirin; iyi drenaj, kok gelisiminin en buyuk destekcisidir.',
  '🫑 Biberde dengeli gubreleme onemli: asiri azot yaprak verir, meyve tutumunu geciktirir.',
  '🌡️ Sera havalandirmasini gun icinde kademeli yapin; ani sicaklik dususleri cicek dokumune yol acabilir.',
  '💧 Damla sulamada sik ve az su, derin koklenme icin uzun araliklarla bol sudan genelde daha iyidir.',
  '🌱 Tohum ekiminde derinlik kurali: tohum buyuklugunun 2-3 kati derinlik cogu sebzede yeterlidir.',
];

const LOCAL_SEED_VALUES = [
  '🌱 Yerli tohum, guclu uretici, bereketli gelecek.\nIslah ve uretim deneyimimizi sahayla bulusturuyoruz.',
  '🇹🇷 Yerli islah, yerli tohum: ureticimizin emegine deger katan secim.\nSahada denenmis cesitlerle yaninizdayiz.',
  '🌱 Tohum bir mevsimlik degil, bir gelecek yatirimidir.\nYerli cesitlerimizle ureticinin yanindayiz.',
  '🫑 Toprağına guvenen ureticiye, islahina guvenen tohum yakisir.\nYerli tohumda deneyim ve süreklilik.',
];

const INTERACTION_POLLS = [
  'Sence hangisi sezonun yıldızı olacak?\n\n🔴 Kırmızı kapya\n🟢 Charliston\n🫑 Dolmalık\n\nCevabını yorumda yaz, çeşit önerimizi paylaşalım.',
  'Domateste üretici için en kritik özellik hangisi?\n\n🍅 Tat\n📦 Raf ömrü\n🌱 Hastalık dayanımı\n\nSenin önceliğin hangisi?',
];

const HUMAN_RESEARCH = [
  "Bir tohumun arkasında laboratuvarda yıllarca süren ıslah, deneme ve sabır var.\n\nKendi Ar-Ge'miz, kendi ıslahımız. Her tescilli çeşidin görünmeyen emeği burada başlıyor.",
  'Bir çeşidin sahaya çıkması sadece fikirle olmaz.\n\nIslah, deneme, gözlem ve tekrar... Üreticinin güveneceği sonuç için perde arkasında uzun bir emek var.',
];

const FIELD_PROOFS = [
  'Tarlada güçlü çıkış, üreticinin ilk güven işaretidir.\n\nHomojen gelişim ve doğru çeşit seçimi; sezonun devamındaki performans için sağlam başlangıç sağlar.',
  'Sahada gördüğümüz her sonuç, ıslah kararlarımızı daha iyi hale getirir.\n\nTohumda güven; katalog cümlesinden değil, üreticinin tarlasındaki kanıttan doğar.',
];

function textForSlot(ctx: TwitterTweetContext, bySlot: Record<string, string>, fallback: string) {
  return (ctx.strategySlotKey && bySlot[ctx.strategySlotKey]) || fallback;
}

/** ISO hafta numarasına göre deterministik havuz seçimi (her hafta farklı metin). */
function pickByWeek(pool: string[], isoWeekStr: string): string {
  const week = Number(isoWeekStr.split('-W')[1] || 1);
  return pool[week % pool.length]!;
}

function firstSentence(text: string, fallback: string) {
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.split(/(?<=[.!?])\s+/u)[0]?.slice(0, 110).trim() || fallback;
}

function varietyTitle(title: string) {
  return /\bf1\b/i.test(title) ? title : `${title} F1`;
}

export function buildTweetFallback(
  template: TwitterTemplate,
  ctx: TwitterTweetContext,
  isoWeekStr: string,
): string {
  const product = ctx.product;

  if (template === TwitterTemplate.InteractionPoll) {
    return textForSlot(ctx, {
      '02-kapya-charliston-poll': INTERACTION_POLLS[0]!,
      '11-tomato-poll': INTERACTION_POLLS[1]!,
    }, pickByWeek(INTERACTION_POLLS, isoWeekStr));
  }
  if (template === TwitterTemplate.InteractionQuestion) {
    return 'Üreticiye soruyoruz:\n\nBu sezon tohumda seni en çok ne zorladı: çıkış mı, hastalık mı, verim mi?\n\nDeneyimini paylaş; birlikte çözelim.';
  }
  if (template === TwitterTemplate.VarietyPromo && product) {
    const detail = firstSentence(compactDescription(product), 'Katalogdaki cesitlerimizden biri.');
    return [`🫑 ${varietyTitle(product.title)}`, '', `🌱 ${detail}`, '', 'Tescilli yerli çeşidimiz, sahada kanıtlı.', '', `Detay: ${ctx.linkUrl}`].join('\n');
  }
  if (template === TwitterTemplate.HumanResearch) {
    return textForSlot(ctx, {
      '04-lab-research': HUMAN_RESEARCH[0]!,
      '10-breeding-story': HUMAN_RESEARCH[1]!,
    }, pickByWeek(HUMAN_RESEARCH, isoWeekStr));
  }
  if (template === TwitterTemplate.FieldProof) {
    return textForSlot(ctx, {
      '07-field-proof': FIELD_PROOFS[0]!,
      '14-grower-proof': 'Kısa saha gözlemi:\n\nÜreticinin tarlasında güçlü çıkış, homojen gelişim ve doğru çeşit seçimi sezonun güvenini artırır.\n\nHer saha sonucu, yerli ıslah yolculuğumuzda bize yeni veri sağlar.',
    }, pickByWeek(FIELD_PROOFS, isoWeekStr));
  }
  if (template === TwitterTemplate.SeedMyth) {
    return '"Tohumun hepsi aynı" mı?\n\nHayır. Sertifikalı tohum; çimlenme, homojen gelişim ve sahada öngörülebilirlik için kritik başlangıç noktasıdır.\n\nRiski azaltmanın ilk adımı doğru çeşitle başlar.';
  }
  if (template === TwitterTemplate.ExportVision) {
    return textForSlot(ctx, {
      '01-export-manifesto': 'Tescilli yerli ıslah, kendi üretim gücü ve sahadan gelen güven...\n\nVista Seeds olarak hedefimiz net: Türk tohumunu daha güçlü, daha görünür ve daha rekabetçi biçimde dünyaya taşımak.',
      '12-export-vision': 'Yerli ıslahımız sınırları aşıyor.\n\nKendi çeşitlerimizle Türk tohumunu dünyaya taşıma yolundayız.\n\nHedefimiz net: üreticiden güç alan yerli tohumu daha geniş pazarlara ulaştırmak.',
    }, 'Yerli ıslahımız sınırları aşıyor.\n\nKendi çeşitlerimizle Türk tohumunu dünyaya taşıma yolundayız.\n\nHedefimiz net: üreticiden güç alan yerli tohumu daha geniş pazarlara ulaştırmak.');
  }
  if (template === TwitterTemplate.IndustryEvent) {
    return `🌍 ${ctx.event?.title || 'Tohum sektoru'} gundemini yakindan izliyoruz.\nYerli tohum gucunu ureticiyle bulusturmak icin calisiyoruz.`;
  }
  if (template === TwitterTemplate.NationalDay) {
    return `${ctx.event?.title || 'Milli gunumuz'} kutlu olsun.\nTopraga emek veren tum ureticilerimize saygi ve minnetle.`;
  }
  if (template === TwitterTemplate.AgronomyTip) {
    return pickByWeek(AGRONOMY_TIPS, isoWeekStr);
  }
  return pickByWeek(LOCAL_SEED_VALUES, isoWeekStr);
}

/** AI çıktısındaki satır içi hashtag'leri temizler (etiketler kurallı eklenir). */
export function stripInlineHashtags(text: string): string {
  return String(text || '')
    .replace(/(^|\s)#[\p{L}0-9_]+/gu, '$1')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

/** Caption'ı hashtag bütçesiyle 280'e sığdırır. */
export function trimToTweet(text: string, hashtags?: string) {
  const clean = text.replace(/\s+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  const tagBudget = hashtags?.trim() ? hashtags.trim().length + 2 : 0;
  const limit = Math.max(80, 280 - tagBudget);
  if (clean.length <= limit) return clean;
  return `${clean.slice(0, Math.max(0, limit - 1)).trimEnd()}…`;
}

export function composeTweetText(caption: string, hashtags: string): string {
  const trimmed = trimToTweet(caption, hashtags);
  return hashtags.trim() ? `${trimmed}\n\n${hashtags.trim()}` : trimmed;
}
