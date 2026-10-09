# Go Clean It (prototype)

Scan a QR sticker on a room door (or a floor sticker), report a cleaning problem with no login, and the on-duty cleaner accepts, works and finishes it with a photo. Clickable prototype in Bahasa Indonesia. Report data lives in the browser and resets on reload.

- `index.html`: the whole prototype (reporter, cleaner, supervisor, admin views). No build step.
- `docs/BLUEPRINT.md`: full build spec for the real version (Next.js + Supabase).
- `docs/DESIGN-UPDATE.md`: why guests need no login and how notifications work.

## Deploy on Vercel
1. Vercel > Add New > Project > import this repo.
2. Project Name must be lowercase, for example `go-clean-it`. Leave everything else as it is (Framework "Other", no build command).
3. Press Deploy.

## Email notifications
When a report is filed or escalated, the page sends an email to the on-duty coordinator through [Web3Forms](https://web3forms.com). It runs in the browser, so there is no server and no Vercel setting to touch.

The key is the `MAIL_KEY` value near the top of the script in `index.html`. A Web3Forms access key is public by design and can only send mail to the address it was created for. To change the receiving address, create a new key at web3forms.com and replace `MAIL_KEY`.

To check it: open the deployed page, find "Notifikasi email ke petugas jaga" in the left panel, and press "Kirim email uji". Also check the spam folder the first time.

## Privacy note for testers
If a tester types a WhatsApp number, it is included in the notification email. Tell testers before they try it.
