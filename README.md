# OkzByte

Premium responsive technology venture website for OkzByte.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Included

- Responsive React/Vite single-page experience with 10 client-side routes
- Cinematic CSS hero with reduced-motion support and mobile fallback
- Supplied OkzByte logo asset
- Technologies, solutions, ecosystem, research, contact, privacy and terms pages
- Contact form validation with honest prototype success state
- Route manifest, robots.txt and sitemap.xml
- No invented clients, awards, partnerships or performance claims


## Contact and support center

The contact, support, FAQ, ticket-submission and ticket-tracking pages are available at `/contact`, `/support`, `/support/faq`, `/support/ticket` and `/support/track`. To persist submissions, configure the server-side `DATABASE_URL`, then apply `db/migrations/005_support_center.sql` to the same PostgreSQL database. Configure `RESEND_API_KEY`, `RESEND_FROM_EMAIL` and `SUPPORT_NOTIFICATION_EMAIL` to enable customer confirmations and support-team notifications. Email is never reported as sent unless the provider accepts the request.

The support API applies input validation, consent checks, per-process rate limits, duplicate inquiry keys and 5 MB allowlisted attachment checks; attachment bytes are stored in the database and are not exposed by public API responses. Authenticated server admin endpoints are `/api/admin/support/inquiries` and `/api/admin/support/tickets`; ticket updates use `PATCH /api/admin/support/tickets/:ticketCode` and require the existing `okz_session` administrator session. On Vercel, public support APIs are exposed as serverless functions; admin support management currently depends on the existing Node server session/auth flow. Apply the migration before accepting real customer data. Configure database backups and retention according to the approved Privacy Policy before launch.

Ticket tracking currently requires both the high-entropy ticket reference and registered email. Expiring email verification links, customer reply threads, administrator assignment/reply UI, FAQ CMS management, audit-log identity linkage and end-to-end live database/email/attachment tests remain production work and are not claimed as complete.
