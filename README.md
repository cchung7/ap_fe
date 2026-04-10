# AP Frontend (`ap_fe`) - SVA Website w/ Admin & Profile Dashboard.

Frontend application for the AP project, built with **Next.js 16 App Router**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **Radix UI**, and **framer-motion**.

This frontend serves the public-facing UI and authenticated dashboard experience, and proxies frontend `/api/**` route handlers to the backend API.

---

## Overview

The frontend currently includes:

* public routes such as the home page and events experience
* authenticated member-facing routes such as profile views
* admin-facing routes under `/admin`
* frontend API route handlers that proxy requests to the backend
* cookie-based authentication checks through middleware and the auth provider

At a high level:

* the browser talks to the **frontend**
* the frontend talks to the **backend** through proxied route handlers
* authentication state is determined from a cookie-backed JWT and `/api/auth/me`

---

## Tech Stack

### Core

* **Next.js** `^16.1.6`
* **React** `^19.2.4`
* **TypeScript** `^5`

### UI and styling

* **Tailwind CSS** `^4`
* **Radix UI**
* **lucide-react**
* **framer-motion**
* **react-icons**
* **sonner**

### Data and utilities

* **SWR**
* **jwt-decode**
* **nodemailer**
* **clsx**
* **tailwind-merge**

---

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run sync:majors
```

### Script details

* `npm run dev` — starts the development server on **port 3001**
* `npm run build` — creates the production build
* `npm run start` — runs the production server
* `npm run lint` — runs ESLint
* `npm run sync:majors` — runs the UTD majors sync script

---

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a local environment file such as `.env.local`.

Minimum frontend variables inferred from the current code:

```env
API_BASE_URL=http://localhost:4000
# Optional fallback used in getBackendBaseUrl()
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000

# Optional; defaults to "token" if omitted
COOKIE_NAME=token
```

### 3. Start the frontend

```bash
npm run dev
```

The frontend runs at:

```text
http://localhost:3001
```

---

## Backend Integration

The frontend does not call the backend directly from client code in most places. Instead, it uses **frontend route handlers** that proxy requests to the backend.

### Proxy behavior

`src/lib/proxy.ts` is responsible for:

* resolving the backend base URL
* forwarding request method, body, query params, and cookies
* relaying `set-cookie` headers from the backend back to the browser
* returning a safe `502` response if the backend cannot be reached

### Backend base URL resolution

The proxy resolves the backend base URL in this order:

1. `API_BASE_URL`
2. `NEXT_PUBLIC_API_BASE_URL`
3. `http://localhost:4000`

---

## Authentication Architecture

Authentication is currently **cookie-based** and centered around a JWT stored in a cookie.

### Frontend auth pieces

#### `middleware.ts`

The middleware:

* reads the auth cookie using `COOKIE_NAME` or `token`
* decodes the JWT payload
* treats invalid or expired tokens as logged out
* redirects unauthenticated users from protected routes to `/login?next=<pathname>`
* redirects authenticated users away from `/login` and `/signup`
* blocks non-admin users from `/admin`

#### `/api/auth/me`

The frontend route handler at:

```text
src/app/api/auth/me/route.ts
```

proxies to the backend endpoint:

```text
/api/auth/me
```

#### `AuthProvider`

`src/components/auth/AuthProvider.tsx`:

* fetches `/api/auth/me` on mount
* stores the resolved user in React context
* exposes:

  * `me`
  * `loading`
  * `error`
  * `isAuthed`
  * `isAdmin`
  * `refresh()`
  * `clearAuth()`

### Backend auth pieces

From the provided backend templates:

* `src/lib/jwt.ts` signs JWTs with `JWT_SECRET`
* token expiration is controlled by `JWT_EXPIRES_IN`
* if `JWT_EXPIRES_IN` is not set, it currently defaults to **`7d`**
* `src/lib/auth.ts` verifies the cookie token and exposes `optionalAuth()` and `requireAuth()`
* `app/api/auth/me/route.ts` resolves the current user from the token

---

## Current Session Behavior

Based on the provided frontend and backend code, the current system appears to support **token expiration**, but not yet a true **idle timeout / sliding session**.

### What appears to exist now

* the JWT includes an expiration (`exp`) through `JWT_EXPIRES_IN`
* frontend middleware treats expired tokens as logged out
* backend token verification rejects expired or invalid tokens
* auth state is re-hydrated through `/api/auth/me`

### What is still unknown from the provided files

The following pieces were not included, so the current session behavior cannot be assessed with full certainty:

* the login route that creates the token
* the logout route, if one exists
* the exact cookie options used when setting the auth cookie:

  * `httpOnly`
  * `secure`
  * `sameSite`
  * `maxAge`
  * `expires`
  * `path`
* whether the backend refreshes or rotates the token during normal activity
* whether any frontend polling or refresh cadence exists beyond initial mount

### Practical interpretation

Without token refresh logic, the current setup is most likely a **fixed-lifetime session**, not an inactivity-based session.

That means:

* a user remains logged in until the token expires
* activity does not appear to extend the session lifetime
* whether closing the browser logs the user out depends on how the cookie is set in the login route

If the cookie is persistent and the token lasts 7 days, reopening the browser within that window will likely keep the user logged in.

---

## Recommended Session Direction

The preferred direction for this project is an **idle timeout with sliding renewal**.

### Target behavior

A good initial policy is:

* **idle timeout:** 12 hours
* user stays logged in during normal use
* user who returns after long inactivity must log in again
* user is not forced to log in every single time they reopen the browser shortly after using the app

### Recommended implementation model

1. issue a JWT with a shorter expiration window, such as `12h`
2. set the auth cookie lifetime to match that window
3. refresh the token and cookie during authenticated activity
4. stop refreshing once the user is inactive long enough for the token to expire
5. ensure the frontend clears auth state and redirects cleanly once `/api/auth/me` no longer resolves a user

This creates a **sliding session** rather than a fixed session.

---

## Context Needed for a Full and Accurate Session Assessment

To evaluate the current system precisely and choose the correct optimized outcome, the following additional context is needed.

### Required auth flow context

1. **Login route implementation**

   * where the token is generated
   * where the cookie is set
   * what cookie attributes are used

2. **Logout route implementation**

   * whether logout explicitly clears the cookie
   * whether all cookie attributes match the original cookie when clearing it

3. **Session configuration**

   * current value of `JWT_EXPIRES_IN`
   * current `COOKIE_NAME`
   * environment differences between local and production

4. **Cookie strategy**

   * session cookie vs persistent cookie
   * `maxAge` / `expires`
   * `sameSite`
   * `secure`
   * `httpOnly`

5. **Refresh / renewal logic**

   * whether any backend endpoint rotates tokens today
   * whether `/api/auth/me` is intended to become a refresh point
   * whether middleware or route handlers should ever emit refreshed cookies

6. **Frontend auth UX expectations**

   * what should happen when a session expires while the user is on a protected page
   * whether to show a banner/toast like “Your session expired. Please sign in again.”
   * whether pending form state should be preserved before redirect

7. **Protected-route expectations**

   * which routes must be protected by middleware
   * which routes are public but personalized
   * whether `/events` should remain fully public

8. **Role-specific policy**

   * whether admins and members should share the same timeout
   * whether admins should have a shorter timeout later

### Useful but secondary context

* any SSR pages that depend on auth cookies
* any mobile-web constraints
* any future “remember me” requirement
* any compliance or security requirement that would justify an absolute timeout in addition to idle timeout

---

## Important Observation About the Current Middleware

The current middleware logic checks:

```ts
pathname.startsWith("/profile")
```

However, the exported matcher is currently:

```ts
matcher: ["/admin/:path*", "/profile", "/login", "/signup"]
```

This means `/profile` is matched, but deeper profile routes such as:

* `/profile/edit`
* `/profile/events`
* other future `/profile/*` paths

may not be passing through frontend middleware at all.

### Recommended matcher adjustment

If the intention is to protect all profile routes, the matcher should likely include:

```ts
"/profile/:path*"
```

This is separate from idle timeout itself, but it matters for an accurate auth/security assessment.

---

## Project Structure Snapshot

```text
ap_fe/
├─ middleware.ts
├─ package.json
├─ tsconfig.json
├─ eslint.config.mjs
├─ components.json
├─ src/
│  ├─ app/
│  │  ├─ api/
│  │  │  └─ auth/
│  │  │     └─ me/
│  │  │        └─ route.ts
│  ├─ components/
│  │  └─ auth/
│  │     └─ AuthProvider.tsx
│  ├─ hooks/
│  │  └─ useMe.ts
│  └─ lib/
│     ├─ api.ts
│     ├─ proxy.ts
│     ├─ points.ts
│     └─ utils.ts
```

---

## Backend Context Used for This Assessment

The following backend files were used to infer current auth/session behavior:

* `src/lib/jwt.ts`
* `src/lib/auth.ts`
* `app/api/auth/me/route.ts`
* `app/api/profile/me/route.ts`
* Prisma schema and enum files

These confirm that:

* authentication is role-aware
* `/api/auth/me` returns the currently resolved user or `me: null`
* `/api/profile/me` requires authentication
* roles and user status are modeled on the backend

---

## Notes for Future README Expansion

This README currently focuses on:

* project setup
* proxy architecture
* auth/session flow
* session assessment context

It can later be expanded with:

* route inventory
* admin/member feature inventory
* deployment instructions
* environment variable reference table
* testing notes
* coding conventions

---

## Summary

The current AP frontend already has the foundations for authenticated routing and token expiration, but the available code suggests the session model is currently closer to a **fixed JWT lifetime** than a true **idle timeout**.

To implement the intended behavior cleanly, the next step is to inspect the login/logout cookie lifecycle and add a deliberate **sliding-session** strategy.
