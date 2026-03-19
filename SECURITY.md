# Security Policy

## Supported Versions

`@idoa/dev-doctor-flow` is pre-1.0. Security fixes are applied on the latest minor release.

## Reporting a Vulnerability

Please open a private security report to maintainers with:

- issue summary
- reproduction steps
- potential impact
- suggested mitigation

Do not post exploitable details publicly until a fix is available.

## Security Principles

- do not store secrets in repository code
- prefer environment-based secret injection
- parse user/project config with validation and safe defaults
- fail clearly when assumptions are unsafe
