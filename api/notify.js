// Vercel serverless function: emails the on-duty coordinator when a report is filed or escalated.
// Secrets come from Vercel environment variables. Nothing secret is in this repo.
//   RESEND_API_KEY   key from resend.com
//   NOTIFY_EMAIL_TO  address that receives the emails
//   NOTIFY_EMAIL_FROM (optional) default: Go Clean It <onboarding@resend.dev>

const CATEGORIES = ['Toilet', 'Lantai', 'Sampah', 'Jendela', 'Meja dan kursi', 'Lainnya'];
const EVENTS = { new_report: 'Laporan baru', escalated: 'Laporan diteruskan ke supervisor' };
const hits = new Map(); // best-effort rate limit per warm instance

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clean = (s, max) => String(s == null ? '' : s).replace(/[\r\n\t]+/g, ' ').trim().slice(0, max);

function limited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  list.push(now);
  hits.set(ip, list);
  const all = [...hits.values()].reduce((n, l) => n + l.filter((t) => now - t < 3600 * 1000).length, 0);
  return list.length > 10 || all > 60;
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  const key = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL_TO;
  if (!key || !to) return res.status(503).json({ error: 'not_configured' });

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (limited(ip)) return res.status(429).json({ error: 'rate_limited' });

  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = null; } }
  if (!b || !EVENTS[b.event]) return res.status(400).json({ error: 'bad_request' });

  const room = clean(b.room, 60);
  const building = clean(b.building, 80);
  const category = CATEGORIES.includes(b.category) ? b.category : 'Lainnya';
  const note = clean(b.note, 200);
  const wa = /^[+0-9 ()-]{0,20}$/.test(String(b.wa || '')) ? clean(b.wa, 20) : '';
  if (!room) return res.status(400).json({ error: 'bad_request' });

  const title = EVENTS[b.event];
  const subject = `[Go Clean It] ${title}: ${room}`;
  const lines = [`${title}`, `Ruangan: ${room}`, `Gedung: ${building}`, `Masalah: ${category}`, note && `Catatan: ${note}`, wa && `WhatsApp pelapor: ${wa}`].filter(Boolean);
  const html = `<div style="font-family:Segoe UI,Arial,sans-serif;font-size:15px;color:#10302B"><h2 style="margin:0 0 8px">${esc(title)}</h2>${lines.slice(1).map((l) => `<div>${esc(l)}</div>`).join('')}<p style="color:#587570;font-size:12px;margin-top:16px">Email otomatis dari prototipe Go Clean It.</p></div>`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: process.env.NOTIFY_EMAIL_FROM || 'Go Clean It <onboarding@resend.dev>', to: [to], subject, text: lines.join('\n'), html }),
    });
    if (!r.ok) return res.status(502).json({ error: 'send_failed' });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ error: 'send_failed' });
  }
};
