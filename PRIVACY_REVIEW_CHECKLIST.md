# OkzByte Privacy Center — Release Review Checklist

Prepared against the repository snapshot reviewed on 15 November 2026. This checklist is operational documentation, not a legal opinion or proof of the production deployment's configuration.

## Verified in the reviewed code

- The `/privacy` route previously rendered a five-paragraph placeholder; it is replaced with a responsive Privacy Center with 20 anchored policy sections, in-page search, print / Save as PDF, route metadata, and breadcrumb JSON-LD.
- No public account registration, payment flow, analytics SDK, marketing pixel, or cookie-consent manager was found in the reviewed frontend/source. Google Fonts are loaded remotely.
- Public Contact form currently displays a local prototype confirmation and does not call the contact API. The server has a separate `/api/contact` path that can insert an inquiry and hashed client fingerprint into PostgreSQL if deployed and configured.
- Research proposals post name, email, optional organization and external URL, research area, submission type, proposal text, and consent to a server endpoint. File attachments are not enabled.
- The research newsletter form sends email, optional topics, and consent. Server code records requests as pending confirmation; the reviewed code does not implement email confirmation, delivery, or unsubscribe.
- Careers talent-network form sends name, email, area of interest, optional portfolio URL, note, and consent. Server code can store through Supabase and optionally notify using Resend when configured. The public page does not currently accept CVs or applications to a live vacancy.
- The careers migration includes future application/CV metadata tables, but a schema is not evidence that an upload flow, private storage, scanning, or authenticated retrieval is operational.
- The server source sets security headers; applies input validation, payload bounds, and basic in-memory rate limits on selected routes; uses parameterized PostgreSQL queries; stores secrets in server environment variables; and verifies configured administrator passwords with scrypt. Its configured admin session cookie is HttpOnly, SameSite=Strict, Secure in production, and has an eight-hour maximum age.
- The new privacy request form posts to `/api/privacy/requests`; both the Node server route and the Vercel function adapter check browser Origin against request Host when supplied, apply per-process/function-instance rate limits, validate fields and consent, generate a reference, and insert the request into a dedicated table. Migration `db/migrations/004_privacy_requests.sql` must be applied and `DATABASE_URL` configured before storage works. The API has no public read endpoint.
- No fixed retention/deletion schedule, production provider-region configuration, backup policy, production log settings, or fully configured policy CMS/revision workflow is established by the reviewed source.

## Administrator decisions and technical configuration required

- [ ] Confirm the live deployment URL, host, data-center region, database provider/region, logs, backup and recovery behavior, and any CDN/WAF services. Update third-party disclosures if needed.
- [ ] Confirm whether `DATABASE_URL`, Supabase, Resend, and administrator-auth settings are actually configured in production; verify migration versions and which forms are exposed.
- [ ] Apply `db/migrations/004_privacy_requests.sql` before advertising that online privacy requests are stored. Test the complete request submission and reference response on the deployed domain.
- [ ] Provide an authenticated, role-restricted privacy-request inbox and workflow. The present site admin dashboard is a prototype; this change does not add a request-review UI, admin status API, role management, or deletion controls.
- [ ] Set category-specific retention/deletion periods (privacy requests, contact inquiries, research submissions, newsletter requests, careers interest, technical/security logs) and implement the required cleanup process.
- [ ] Decide and publish a dedicated privacy contact if appropriate; verify that `hello@okzbyte.com` is monitored for privacy requests.
- [ ] Confirm form ownership, inbox recipients, data-access permissions, administrator access lifecycle, and response/identity-verification procedures.
- [ ] Verify whether the Contact form should be connected to its server endpoint; until then, preserve the page's clear prototype disclaimer.
- [ ] If launching newsletter delivery, implement and test confirmation and unsubscribe flows, then update the policy.
- [ ] If enabling CV/application uploads or optional cookies/analytics/marketing, complete threat/privacy review and update disclosures/consent before collection.
- [ ] Confirm mobile, desktop, keyboard, print/Save-as-PDF behavior; test privacy form validation, origin protection, rate limit, missing-schema handling, and no sensitive information in URLs or logs.

## Qualified legal review required

- [ ] Confirm the responsible legal entity/controller name, registered or business address if disclosure is required, operating establishment(s), and the jurisdictions in which OkzByte offers services or monitors people.
- [ ] Determine whether Pakistani privacy/data-protection rules, GDPR, UK GDPR, CCPA/CPRA, or other national/state laws apply to the actual entity, activities, and users; verify current legal requirements and lawful bases.
- [ ] Review controller/processor roles, notices, consent language, children's-data obligations, international-transfer mechanisms, response timelines, exceptions, complaint/redress routes, and any regulator contact requirements.
- [ ] Review service-provider agreements and data-processing terms for the actual hosting, database, email, CDN, analytics, font, and recruitment services in production.
- [ ] Approve effective date/version and remove the operational-draft banner only after unresolved facts and claims are confirmed.

## Release decision

Do not describe the online request workflow as operational until the migration, database configuration, production route, and authenticated administrator review process are verified. Do not publish fixed retention promises, certifications, or jurisdictional compliance claims without confirmed settings and qualified legal approval.
