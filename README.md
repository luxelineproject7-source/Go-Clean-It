# Go Clean It (prototype)

Scan a QR sticker on a room door (or a floor sticker), report a cleaning problem with no login, and the on-duty cleaner accepts, works and finishes it with a photo. Clickable prototype in Bahasa Indonesia. Report data lives in the browser and resets on reload.

- `index.html`: the whole prototype (reporter, cleaner, supervisor, admin views). No build step.
- `docs/BLUEPRINT.md`: full build spec for the real version (Next.js + Supabase).
- `docs/DESIGN-UPDATE.md`: why guests need no login and how notifications work.

## Deploy on Vercel
1. Vercel > Add New > Project > import this repo.
2. Project Name must be lowercase, for example `go-clean-it`. Leave everything else as it is (Framework "Other", no build command).
3. Press Deploy.

## Shared data (so every phone sees the same reports)
Without this the app keeps data only in each browser. To share it, use a free Supabase project:
1. supabase.com > New project.
2. SQL Editor > New query > paste `supabase-setup.sql` > Run.
3. Project Settings > API: copy the **Project URL** and the **anon public** key. Never use the `service_role` key.
4. Replace `__SUPABASE_URL__` and `__SUPABASE_KEY__` near the top of the script in `index.html`, commit, push. Vercel redeploys.

The page polls the database every 3 seconds. "Accept" is atomic in the database, so two cleaners pressing it together get exactly one winner. This open-table setup is for the prototype only. Do not enter real personal data. The production design is in `docs/BLUEPRINT.md`.

## Email notifications
When a report is filed or escalated, the page sends an email to the on-duty coordinator through [Web3Forms](https://web3forms.com). It runs in the browser, so there is no server and no Vercel setting to touch.

The key is the `MAIL_KEY` value near the top of the script in `index.html`. A Web3Forms access key is public by design and can only send mail to the address it was created for. To change the receiving address, create a new key at web3forms.com and replace `MAIL_KEY`.

To check it: open the deployed page, find "Notifikasi email ke petugas jaga" in the left panel, and press "Kirim email uji". Also check the spam folder the first time.

## Privacy note for testers
If a tester types a WhatsApp number, it is included in the notification email. Tell testers before they try it.
