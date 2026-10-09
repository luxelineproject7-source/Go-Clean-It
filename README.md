# Go Clean It (prototype)

Scan a QR sticker on a room door (or a floor sticker), report a cleaning problem with no login, and the on-duty cleaner accepts, works and finishes it with a photo. Clickable prototype in Bahasa Indonesia. All data lives in the browser and resets on reload.

- `index.html`: the whole prototype (reporter, cleaner, supervisor, admin views).
- `api/notify.js`: emails the coordinator when a report is filed or escalated.
- `docs/BLUEPRINT.md`: full build spec for the real version (Next.js + Supabase).
- `docs/DESIGN-UPDATE.md`: why guests need no login and how notifications work.

## Try it
Open the deployed link, pick a role in the left panel (on a phone it is above the app), then follow "Coba urutan ini".

## Deploy on Vercel
1. Vercel > Add New > Project > import this GitHub repo. No build settings needed.
2. Project > Settings > Environment Variables, add:
   - `RESEND_API_KEY`: key from resend.com
   - `NOTIFY_EMAIL_TO`: the address that should receive notifications
3. Redeploy. Without these two variables the app still works, it just sends no email.

Resend's free test sender (`onboarding@resend.dev`) delivers only to the email address of your Resend account. Use that same address for `NOTIFY_EMAIL_TO`, or verify a domain in Resend to send to anyone.

## Privacy note for testers
If a tester types a WhatsApp number, it is included in the notification email. Tell testers before they try it.
