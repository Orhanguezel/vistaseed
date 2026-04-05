/**
 * Mail module stub.
 * Her projenin kendi mail konfigurasyonu vardir.
 * Bu stub derleme icin gerekli export'lari saglar.
 * Proje backend'inde override edilir.
 */
export const SITE_NAME = process.env.SITE_NAME ?? 'Tarim Dijital Ekosistem';

export async function sendMailRaw(_opts: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<void> {
  console.warn('[shared-backend] sendMailRaw stub called — override in project');
}

export async function sendWelcomeMail(_input: { to: string; user_name: string; user_email: string }): Promise<void> {
  console.warn('[shared-backend] sendWelcomeMail stub called — override in project');
}

export async function sendPasswordChangedMail(_input: { to: string; user_name?: string }): Promise<void> {
  console.warn('[shared-backend] sendPasswordChangedMail stub called — override in project');
}
