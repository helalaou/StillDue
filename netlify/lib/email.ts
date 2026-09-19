import { emailReady } from './admin';
export function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
export async function sendEmail(to: string, subject: string, html: string, idempotencyKey: string) {
  if (!emailReady()) throw new Error('Email delivery is not configured.');
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + process.env.RESEND_API_KEY,
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify({ from: process.env.EMAIL_FROM, to: [to], subject, html }),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error('Email provider returned ' + response.status);
  return await response.json();
}
export function emailLayout(title: string, body: string) {
  const url = process.env.APP_URL || 'https://stilldue.netlify.app';
  return `<div style="font-family:Arial,sans-serif;max-width:560px;margin:40px auto;color:#243d35;line-height:1.7"><p style="font-size:24px;font-weight:600">StillDue.</p><h1 style="font-size:25px">${escapeHtml(title)}</h1>${body}<p><a style="color:#245447" href="${escapeHtml(url)}">Open your workspace</a></p><hr style="border:0;border-top:1px solid #dfe5dc"><p style="font-size:12px;color:#66746d">Change reminder preferences or turn these emails off in StillDue Settings.</p></div>`;
}
