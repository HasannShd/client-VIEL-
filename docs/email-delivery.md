# Email Delivery Setup

The site backend can send form submissions through Resend without asking the client for an email password.

## Recommended Flow

1. Create a Resend account.
2. Add the client domain, for example `viel-gs.de`.
3. Ask the client or domain manager to add the DNS records Resend provides.
4. After the domain is verified, create a sending API key.
5. Configure production environment variables:

```env
CONTACT_TO_EMAIL=info@viel-gs.de
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=VIEL Website <website@viel-gs.de>
REQUIRE_EMAIL_DELIVERY=true
```

No client inbox password is required. The API key can be revoked by the client at any time.

## Local Testing

Without `RESEND_API_KEY` or SMTP credentials, the backend stays in dry-run mode. It accepts the form submission and prints the email content in the backend console.

Use this for temporary local testing:

```env
CONTACT_TEST_EMAIL=hasnshahidd@gmail.com
EMAIL_PROVIDER=dry-run
REQUIRE_EMAIL_DELIVERY=false
```

Remove `CONTACT_TEST_EMAIL` before production.
