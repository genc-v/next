# Shorty — URL Shortener & Analytics

A full-stack URL shortener built with **Next.js 16**, **NextAuth v5**, **MongoDB**, and **Tailwind CSS v4** for the course *Zhvillim i Ueb-it në Anën e Klientit*.

---

## Features

- **URL Shortening** — 7-character alphanumeric codes generated with nanoid, collision-safe
- **Click Analytics** — every redirect records device type, OS, browser, referrer, and IP
- **Filterable Analytics** — filter click history by device, OS, browser, and date range
- **Favorites** — mark and review important links from a dedicated page
- **Dashboard** — create, copy, delete, and manage all shortened URLs with pagination
- **Profile Settings** — update display name and change password
- **Admin Panel** — search, edit, and delete any user or link platform-wide
- **Authentication** — email/password (bcrypt) + Google OAuth via NextAuth v5
- **Role-based Middleware** — protects authenticated routes, redirects non-admins from admin panel
- **Contact Form** — validated with React Hook Form, stored in MongoDB

---

## Pages

| Route | Description | Access |
|---|---|---|
| `/` | Landing page with features and how-it-works | Public |
| `/about` | Tech stack, highlights, user/admin capabilities | Public |
| `/contact` | Validated contact form saved to MongoDB | Public |
| `/faq` | Grouped accordion Q&A | Public |
| `/auth/signin` | Sign in with credentials or Google | Public |
| `/auth/signup` | Create a new account | Public |
| `/dashboard` | Create and manage shortened URLs | User |
| `/profile` | Update name and change password | User |
| `/favorites` | View favorited URLs | User |
| `/urls/[code]` | Per-link click analytics with filters | User |
| `/admin` | Manage all users and URLs platform-wide | Admin |
| `/[code]` | Short URL redirect — tracks click event | Public |

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
| Jest + Testing Library | 30 / 16 | Unit and component tests |

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
git clone https://github.com/genc-v/next.git
cd next
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

### 4. Start MongoDB (Docker)

```bash
docker-compose up -d
```

### 5. Seed an admin account

```bash
npm run seed:admin
```

Default credentials: `admin@shorty.local` / `admin123`

### 6. Run the development server

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
npm run seed:admin # Create or promote an admin user
```

---

## Tests

```bash
npm test
```

| Suite | Coverage |
|---|---|
| Utility functions | `isValidUrl`, `generateShortCode`, `parseUA` |
| Button component | Renders, variants |

---

## Contributors

| Contributor | Responsibilities |
|---|---|
| Contributor 1 | Authentication system — NextAuth v5 setup, Google OAuth, credentials provider, JWT sessions, role-based middleware |
| Contributor 2 | Database layer — MongoDB models (User, Click, ContactMessage), Mongoose schemas, database connection and seeding |
| Contributor 3 | Core API routes — URL shortening, CRUD operations, click tracking, profile and contact endpoints |
| Contributor 4 | Admin panel — user and URL management, search, pagination, admin-only access control |
| Contributor 5 | Frontend & UI — dashboard, analytics page, favorites, profile settings, loading skeletons, responsive Tailwind styling |
