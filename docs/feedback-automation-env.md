# Feedback automation environment

The public request flow will use GitHub Issues as the canonical record and Resend for receipt/progress email.

## Required for Phase 1

```env
GITHUB_TOKEN=
GITHUB_OWNER=ohmyzhs
GITHUB_REPO=agency-web
NEXT_PUBLIC_GITHUB_REPO_URL=https://github.com/ohmyzhs/agency-web
```

Recommended token for v1: fine-grained GitHub PAT scoped only to `ohmyzhs/agency-web` with:

- Metadata: read
- Issues: read/write

## Required for Phase 2

```env
RESEND_API_KEY=
FEEDBACK_FROM_EMAIL="Zero Human Studio <support@ohmyzhs.com>"
FEEDBACK_REPLY_TO=support@ohmyzhs.com
```

Before enabling email, verify `ohmyzhs.com` in Resend and add the DNS records Resend provides.

## Privacy rule

Do not put reply email addresses or other private contact details in public GitHub issue bodies. Email may be used for receipt/progress notifications, while GitHub issue comments remain the canonical public progress log.
