# Campus Clean: design update (v3)

Trigger: the lecturer asked "why not just use WhatsApp?". This update answers that and changes three parts of BLUEPRINT.md.

## Why this is more than a WhatsApp group
| WhatsApp group or number | Campus Clean |
|---|---|
| Messages get buried, nobody owns a message | Each report has one owner, one status and a timer |
| Cleaner must guess which room "toilet lantai 2" means | The QR gives the exact room, so no guessing |
| Two cleaners both reply, or neither does | One atomic accept. Others see "Sudah diambil" |
| No record, no proof | Before and after photos, audit trail, rating |
| Nobody can measure response time | Median response time, escalation at 10 minutes |

Decision: **keep WhatsApp, but as the delivery channel, not the system.** Reporters can still reach a person on WhatsApp from the same QR page.

## 1. QR code to web page (no app, no login)
Flow: scan QR, room page opens, 2 big choices.
1. **Laporkan masalah kebersihan** (form: tap problem type, optional note and photo, send).
2. **Hubungi petugas jaga via WhatsApp** (opens `wa.me` with the room name already typed in).

Rules that make it easy:
- The room is known from the QR, so the reporter never types a room or a phone number.
- Three reassurance chips on the first screen: tanpa login, tanpa unduh aplikasi, gratis.
- The WhatsApp button is also on the status page. It becomes the main button when the report is escalated or nobody has accepted.
- If a report for the same room and problem is already open, the page says so and merges the new one.

## 2. Notifications and login
| Person | Account | How they sign in | How they are notified |
|---|---|---|---|
| Reporter (student, lecturer, staff) | **None** | Nothing. The browser keeps a device token so "Laporanku" works on that phone | Status page by link. Optional WhatsApp number for updates |
| Cleaner | Created by admin | Tapping the link in the WhatsApp message (one-time, about 20 minutes, bound to that cleaner and report). Long session after first sign-in | WhatsApp message with a link. Free fallback: browser push if the PWA is installed |
| Supervisor, admin | Created by admin | Email plus TOTP | WhatsApp for escalations, email for the weekly summary |

Why guests are safe without login (changes blueprint section 6.3 and 6.9):
- A report is tied to a room QR token, so it can only land in a real, active room.
- Limits per device and per IP: 5 reports per hour, plus a bot check (for example Cloudflare Turnstile, free).
- The reporter's optional WhatsApp number is stored on the report and shown only to supervisors, never cleaners.
- Rows are created only by the `create_report` SQL function. Guests still cannot read or write tables directly.

Blueprint impact:
- `report.reporter_id` becomes nullable. Add `report.guest_token_hash` and `report.contact_wa`.
- Guest actions (view status, rate, cancel) are authorised by the guest token stored in the browser, checked in SQL.
- Task links move from Phase 7 into Phase 5, because they are now the cleaners' main sign-in.
- Production WhatsApp needs an official WhatsApp Business API provider (open decision #3 stays open). The prototype shows the messages in a log.

## 3. Simpler and easier on the eyes
- Light theme by default, soft mint background, white cards, one teal accent. Status colours are separate (amber waiting, red escalated, blue in progress, green done).
- Large tap targets (at least 48 px), 15 px body text, short Bahasa Indonesia, one main button per screen.
- Reporter flow is 3 taps: scan, pick problem, send. Everything else is optional.
- Loading: splash on open, skeleton cards when changing screens, spinner and disabled state on buttons that save data.
- Plain status words: Terkirim, Diterima petugas, Sedang dikerjakan, Selesai.

## Still to decide (needs the lecturer or facility unit)
1. Is there one on-duty coordinator number for the WhatsApp button, or one per building?
2. Which WhatsApp provider and who pays for it?
3. Are guests from outside the campus allowed to report? (If not, the QR page can require a quick campus-email check later.)
