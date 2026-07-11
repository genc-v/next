# Shorty — URL Shortener & Analytics

A full-stack URL shortener built with **Next.js 16**, **NextAuth v5**, **MongoDB**, and **Tailwind CSS v4** for the course *Zhvillim i Ueb-it në Anën e Klientit*.

## Live Demo

Hosted on Vercel: [https://next-lilac-sigma-72.vercel.app/](https://next-lilac-sigma-72.vercel.app/)

> Update this link after the final Vercel deployment.

---

## Features

- **URL Shortening** — 7-character alphanumeric codes, collision-safe generation with nanoid
- **Click Analytics** — every redirect records device type, OS, browser, referrer, and IP
- **Filterable analytics page** — filter click history by device, OS, browser, and date range
- **Favorites** — mark and review important links from a dedicated page
- **Dashboard** — create, copy, delete, and manage all shortened URLs
- **Profile settings** — update display name and change password
- **Admin Panel** — search, edit, and delete any user or link platform-wide with pagination
- **Authentication** — credentials (bcrypt) + Google OAuth via NextAuth v5
- **Role-based middleware** — protects all authenticated routes, redirects non-admins away from admin panel
- **Contact form** — validated with React Hook Form, stored in MongoDB

---

## Pages

| Route | Description | Auth |
|---|---|---|
| `/` | Home — landing page with features and how-it-works | Public |
| `/about` | About — tech stack, highlights, user/admin capabilities | Public |
| `/contact` | Contact — validated form saved to MongoDB | Public |
| `/faq` | FAQ — grouped accordion Q&A | Public |
| `/auth/signin` | Sign in with credentials or Google | Public |
| `/auth/signup` | Create a new account | Public |
| `/dashboard` | Create and manage shortened URLs | User |
| `/profile` | Update name and change password | User |
| `/favorites` | View favorited URLs | User |
| `/urls/[code]` | Per-link click analytics with filters | User |
| `/admin` | Manage all users and URLs platform-wide | Admin |
| `/[code]` | Short URL redirect — tracks click event | Public |
| `/_not-found` | 404 page | Public |

---

## Tech Stack

| Technology | Version | Usage |
|---|---|---|
| Next.js | 16 | App Router, Server Components, API Routes, Middleware |
| React | 19 | UI, client components, hooks |
| MongoDB + Mongoose | 9 | Data persistence, 3 models |
| NextAuth | v5 beta | JWT sessions, Google OAuth, credentials |
| Tailwind CSS | v4 | Utility-first styling, responsive design |
| React Hook Form | 7 | Form validation on contact, profile, and auth pages |
| bcryptjs | 3 | Password hashing (cost 12) |
| nanoid | 3 | Short code generation |
| TypeScript | 5 | Full type safety across the codebase |
| Jest + RTL | 30 / 16 | Unit and component tests |

---

## MongoDB Models

**`User`** — stores account info and embedded shortened links
```
name, email, hashedPassword, image, role (user|admin), links[]
  links: { code, originalUrl, clicks, favorite, createdAt, updatedAt }
```

**`Click`** — one document per redirect event, indexed by `urlCode`
```
urlCode, userId, timestamp, device, os, browser, referrer, ip
```

**`ContactMessage`** — contact form submissions
```
name, email, message, createdAt
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/next-url-shortener.git
cd next-url-shortener
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=your_mongodb_connection_string
AUTH_SECRET=your_nextauth_secret_32_chars_min
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Seed an admin account

```bash
npm run seed:admin
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Run ESLint
npm test           # Run all tests
npm run seed:admin # Create initial admin user
```

---

## Tests

Run the full test suite:

```bash
npm test -- --runInBand
```

| Suite | File | Tests |
|---|---|---|
| Button component | `__tests__/components/Button.test.tsx` | 3 |
| Card component | `__tests__/components/Card.test.tsx` | 1 |
| Footer component | `__tests__/components/Footer.test.tsx` | 1 |
| UrlList component | `__tests__/components/UrlList.test.tsx` | 5 |
| UrlForm component | `__tests__/components/UrlForm.test.tsx` | 4 |
| Contact API logic | `__tests__/api/contact.test.ts` | 2 |
| URL API logic | `__tests__/api/urls.test.ts` | 6 |
| Register API logic | `__tests__/api/register.test.ts` | 3 |
| Utility functions | `__tests__/utils/utils.test.ts` | 15 |

**40 tests total across 9 suites.**

---

## Vercel Deployment

1. Push the repository to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add all `.env.local` variables in **Settings → Environment Variables**
4. Deploy — Vercel runs `npm run build` automatically

---

## Screenshots

**Home**
![Home](assets/Screenshot%202026-07-11%20at%2010.23.19.png)

**Dashboard**
![Dashboard](assets/Screenshot%202026-07-11%20at%2010.23.03.png)

**Link Analytics**
![Link Analytics](assets/Screenshot%202026-07-11%20at%2010.23.38.png)

---

## Group Members

| # | Name | Email |
|---|---|---|
| 1 | Genc Vllahiu | gv71594@ubt-uni.net |
| 2 | Orgest Pasha | op70470@ubt-uni.net |
| 3 | Jon Fejzullahu | jf70240@ubt-uni.net |
| 4 | Auron Ismaili | ai73075@ubt-uni.net |
| 5 | Jon Ramadani | jr70703@ubt-uni.net |
