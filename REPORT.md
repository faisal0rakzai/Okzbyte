
## Secure admin authentication layer

The API now includes server-side admin session endpoints: `GET /api/admin/session`, `POST /api/admin/login`, and `POST /api/admin/logout`. Login uses an environment-provided scrypt password hash, generates an expiring random session token, and sets an HttpOnly SameSite cookie. Missing admin configuration returns `503 admin_not_configured`; credentials are never hardcoded.

Tested responses: unauthenticated session returns `{ok:false}`, unconfigured login returns HTTP 503, and health reports the configuration state without exposing secrets.
