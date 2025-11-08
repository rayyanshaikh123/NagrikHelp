# NagrikHelp

NagrikHelp is a civic-tech web application to let citizens report local issues (potholes, waste, signage), track progress, and interact with municipal teams. The project includes a Next.js frontend, a Spring Boot backend, and optional AI/vision services for issue analysis.

This README summarizes the project's functionality, architecture, technologies used, important environment variables, and common development tasks.

## Key Features

- Citizen-facing UI to report and track issues (create, comment, vote).
- Administrator dashboard for triage and managing issue workflows.
- Notifications via email (and optional SMS) to keep citizens informed about issue status.
- Authentication: username/password and Google Sign-In support (with server-side verification and FedCM/GSI workarounds).
- Email verification flow for enabling email notifications.
- SSE (Server-Sent Events) to deliver live notifications to clients.
- Optional AI services (in `ai/`) for local vision and language analysis used to suggest categories and tags.

## Repository Layout (high level)

- `frontend/` — Next.js 14 (app router) TypeScript frontend, Tailwind UI components.
  - `app/` — pages and client components (login, register, citizen profile, admin pages, etc.)
  - `components/`, `hooks/`, `services/` — reusable UI, client-side hooks, and API helpers
- `backend/` — Spring Boot (Gradle) Java backend providing REST APIs, auth, and data persistence
  - `src/main/java/com/nagrikHelp` — controllers, services, models, repositories
  - `src/main/resources/application.properties` — configuration
- `ai/` — optional local AI/vision helpers (python scripts, models)

## Technologies Used

- Frontend: Next.js 14 (app dir), React, TypeScript, Tailwind CSS.
- Backend: Java 17, Spring Boot 3.x, Spring Security, Spring Data MongoDB (MongoDB Atlas used during development), JavaMail for email.
- Auth: JWT tokens, Google ID token verification (server-side), Google Identity Services client integration.
- Notifications: SSE (server-sent events) for real-time notifications.
- SMS (optional): Twilio REST API (server-side) and OTP flows (present but disabled on the frontend by default).
- Dev tooling: pnpm / npm (frontend), Gradle (backend), Python venv for AI scripts.

## High-level Architecture

- Client (Next.js) calls REST endpoints on the backend for authentication, account operations, and issue management.
- Backend authenticates users with JWT and verifies Google tokens when used.
- Notification subsystem uses SSE streams keyed by normalized user email; a `NotificationService` enqueues notifications and `NotificationStreamService` exposes SSE endpoints.
- Email sending is performed by `EmailService` using JavaMailSender — sending is disabled when SMTP credentials are not provided.
- Email verification uses an `EmailVerificationService` to generate short-lived codes and send HTML verification emails using `EmailService.buildEmailBody(...)`.

## Important Behavior & Notes

- Email notifications are disabled by default for new users (`emailConsent` defaults to `false`). Users must verify their email to enable email notifications via the Profile screen.
- SMS/OTP flows: the frontend UI no longer exposes SMS/OTP verification by default. Server-side OTP/SMS code remains but can be disabled by omitting Twilio credentials.
- COOP header: a `frontend/middleware.ts` was added to set `Cross-Origin-Opener-Policy: same-origin-allow-popups` only for HTML/document responses to avoid interfering with Google Identity popup→opener postMessage interactions.
- Local envs: a small `DotenvEnvironmentPostProcessor` is present on the backend to load `.env.local` into Spring's environment in local development. Do NOT commit `.env.local` — it may contain secrets and Git push-protection will block pushes that include secrets.

## Important Environment Variables

Backend (Spring Boot environment variables)

- `SPRING_PROFILES_ACTIVE` — environment profile as needed.
- `MONGODB_URI` or Spring Data MongoDB connection properties — MongoDB connection string.
- `GOOGLE_CLIENT_ID` — (optional) server-side Google client id for aud enforcement when verifying ID tokens.
- `SPRING_MAIL_HOST`, `SPRING_MAIL_PORT`, `SPRING_MAIL_USERNAME`, `SPRING_MAIL_PASSWORD` — set these to enable JavaMail email sending. If not provided, email sending is a no-op (safe for local dev).
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM` — optional Twilio credentials to enable SMS; omit to keep SMS disabled.

Frontend (.env / Next.js)

- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` — Google client id used by the Google Identity client on the frontend.
- `NEXT_PUBLIC_API_BASE` — (optional) override API base URL; if not set, localhost and deployed defaults are used.

Security note: If any secrets are accidentally committed, rotate them immediately and remove the file from the Git history.

## Running Locally

1. Backend (macOS / zsh)

```bash
# from repo root
cd "/Applications/rayyan dev/NagrikHelp/backend"
# Create or export required envs locally (example uses a .env.local managed outside the repo)
# e.g. export GOOGLE_CLIENT_ID=your-client-id
# If you want to test sending email, set SPRING_MAIL_* vars to a testing SMTP like Mailtrap
./gradlew bootRun
```

2. Frontend

```bash
cd "/Applications/rayyan dev/NagrikHelp/frontend"
# set NEXT_PUBLIC_API_BASE and NEXT_PUBLIC_GOOGLE_CLIENT_ID in your shell or .env.local (not committed)
pnpm install
pnpm dev
```

3. Quick smoke checks

- Open the app at `http://localhost:3000` and sign in / register.
- Go to the Profile screen to use the Email Verify flow: click *Verify email* → open your email (or check logs if SMTP is not configured) → enter the code into the profile UI and Confirm → you can then enable email notifications and Save.

## Developer notes & next steps

- Email verification email body is generated by `EmailService.buildEmailBody(...)` for consistent HTML formatting.
- The backend `EmailVerificationService` reuses the OTP throttle repository for basic rate-limiting. Consider a dedicated throttle collection or redis-backed rate limiting for production-scale usage.
- The SSE notification keys are normalized (lowercased email) to ensure stream subscribers receive intended messages.
- If you want emails to be delivered during local development, use Mailtrap or a similar testing SMTP server and set the `SPRING_MAIL_*` env variables.

## Contributing

1. Create a branch for your change.
2. Run tests / linters locally before pushing.
3. Open a PR with a clear description and mention any env requirements.

## Contact & License

This repository is maintained by the project owner. Check the repository root for any LICENSE or CONTRIBUTING files. If you need help reproducing flows (Google sign-in, COOP behavior, email sends), add details and I can help debug.
