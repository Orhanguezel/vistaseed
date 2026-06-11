// src/modules/twitter-content/ai.ts
// Groq ile tweet caption üretimi. Anahtar yoksa/hata olursa throw — çağıran
// taraf deterministik şablona (fallbacks.ts) düşer.

import { env } from '@/core/env';

const SYSTEM_PROMPT = [
  'Sen bir tohum/tarim markasinin sosyal medya editorusun.',
  'Marka: tohum ve tarim sektorunde, hedef kitle ciftciler, ureticiler ve tarim profesyonelleri.',
  'Sade, guvenilir ve abartisiz Turkce yazarsin.',
  'SADECE su JSON formatinda yanit ver: {"caption": "..."}',
].join(' ');

function parseAiJson(content: string): { caption: string } {
  const match = content.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('ai_json_not_found');
  const parsed = JSON.parse(match[0]) as { caption?: unknown };
  const caption = String(parsed.caption || '').trim();
  if (!caption) throw new Error('ai_caption_empty');
  return { caption };
}

/** Groq chat completion ile caption üretir; GROQ_API_KEY yoksa throw eder. */
export async function generateTweetCaption(topic: string): Promise<{ caption: string; model: string }> {
  if (!env.GROQ_API_KEY) throw new Error('groq_api_key_missing');

  const res = await fetch(`${env.GROQ_API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: env.GROQ_MODEL,
      temperature: 0.7,
      max_tokens: 400,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: topic },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`groq_http_${res.status}: ${body.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = String(data.choices?.[0]?.message?.content || '');
  const { caption } = parseAiJson(content);
  return { caption, model: env.GROQ_MODEL };
}
