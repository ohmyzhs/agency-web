# Feedback automation environment

The public request flow uses GitHub Issues as the canonical record and Resend for receipt/progress email.

## Required for GitHub Issue creation

```env
GITHUB_TOKEN=[REDACTED]
GITHUB_OWNER=ohmyzhs
GITHUB_REPO=agency-web
NEXT_PUBLIC_GITHUB_REPO_URL=https://github.com/ohmyzhs/agency-web
```

Recommended token for v1: fine-grained GitHub PAT scoped only to `ohmyzhs/agency-web` with:

- Metadata: read
- Issues: read/write

## Required for receipt email

```env
RESEND_API_KEY=[REDACTED]
FEEDBACK_FROM_EMAIL="Zero Human Studio <no-reply@oh-my-zhs.com>"
FEEDBACK_REPLY_TO=no-reply@oh-my-zhs.com
```

Before enabling email, verify `oh-my-zhs.com` in Resend and add the DNS records Resend provides.

## Privacy rule

Do not put reply email addresses or other private contact details in public GitHub issue bodies. Email may be used for receipt/progress notifications, while GitHub issue comments remain the canonical public progress log.
