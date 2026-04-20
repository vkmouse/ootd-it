## ADDED Requirements

### Requirement: Cloudflare Access user identity
The Worker SHALL read the authenticated user's email from the `cf-access-authenticated-user-email` request header injected by Cloudflare Access.

#### Scenario: Email extracted in production
- **WHEN** a request arrives with the `cf-access-authenticated-user-email` header
- **THEN** the Worker SHALL use that value as the current user's identity for all data operations

---

### Requirement: Local development fallback
When the `cf-access-authenticated-user-email` header is absent (local dev), the Worker SHALL fall back to `demo@example.com` as the user identity.

#### Scenario: Fallback in local dev
- **WHEN** a request arrives without the `cf-access-authenticated-user-email` header
- **THEN** the Worker SHALL use `demo@example.com` as the owner_email

---

### Requirement: Per-user data isolation
All data reads and writes SHALL be scoped to the current user's email, ensuring users cannot access each other's data.

#### Scenario: Queries scoped to owner
- **WHEN** the Worker queries the `clothes` table
- **THEN** all queries SHALL include `WHERE owner_email = <current_user_email>`
