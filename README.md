# Next URL Shortener

Një aplikacion i plotë për shkurtimin dhe menaxhimin e URL-ve, ndërtuar me **Next.js**, **NextAuth**, **MongoDB** dhe **Tailwind CSS**.

## Përshkrimi i Projektit
Ky projekt u zhvillua si detyrë për lëndën "Zhvillim i Ueb-it në Anën e Klientit". Ofron funksionalitete të plota për të:
- Shkurtuar URL të gjata.
- Autentifikuar përdorues me Credentials ose Google.
- Menaxhuar përdoruesit dhe linqet nëpërmjet një Paneli Admini.
- Shfletuar produkte/artikuj me SSG, faqe dinamike me `getStaticPaths`, dhe Favorites për përdoruesit e loguar.
- Ndërvepruar me forma të validuara dhe UI të përshtatshëm (Responsive Design).

## Linku i Aplikacionit Live
Aplikacioni është hostuar në Vercel:
[https://your-vercel-deployment-link.vercel.app](https://your-vercel-deployment-link.vercel.app)

*(Shënim: Linku do të ofrohet pas deployment përfundimtar në Vercel)*

## Anëtarët e Grupit
1. **[Emri i Studentit 1]** - Zhvillimi i modeleve të databazës, Autentifikimi (NextAuth), dhe CRUD i Përdoruesve.
2. **[Emri i Studentit 2]** - UI/UX me Tailwind CSS, Formularët me Validim, dhe Faqet Statike (SSR/SSG/ISR).
3. **[Emri i Studentit 3]** - Custom Hooks, Konfigurimi i Testeve me Jest, dhe Integrimi i API-ve.

## Udhëzime Instalimi
Për ta ekzekutuar këtë projekt në lokalin tuaj, ndiqni këto hapa:

1. **Klononi repository:**
   ```bash
   git clone https://github.com/your-username/next-url-shortener.git
   cd next-url-shortener
   ```

2. **Instaloni dependencat:**
   ```bash
   npm install
   ```

3. **Konfiguroni Variablat e Mjedisit:**
   Krijoni një skedar `.env.local` në root të projektit me vlerat e mëposhtme:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   AUTH_SECRET=your_nextauth_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Ekzekutoni Serverin e Zhvillimit:**
   ```bash
   npm run dev
   ```
   Hapni [http://localhost:3000](http://localhost:3000) në shfletuesin tuaj për të parë rezultatin.

5. **Testimi:**
   Për të rimbajtur testet e krijuara me Jest, përdorni komandën:
   ```bash
   npm run test
   ```

## Teknologjitë e Përdorura
- **Frontend:** React 19, Next.js 16 (App & Pages Router)
- **Stilizim:** Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** MongoDB & Mongoose
- **Autentifikim:** NextAuth.js
- **Forma & Validime:** React Hook Form
- **Testim:** Jest & React Testing Library

## Faqet Kryesore
- `/` Home
- `/about` About
- `/contact` Contact form
- `/auth/signin` dhe `/auth/signup`
- `/dashboard` Dashboard për përdorues të loguar
- `/admin` Admin Panel vetëm për admin
- `/products` Products me SSG dhe ISR
- `/products/[slug]` Product Details me `getStaticPaths`
- `/profile` Profile me përditësim të emrit
- `/favorites` Favorites për përdorues të loguar
- `/faq` dhe `/stats` faqe bonus

## Verifikim Lokal
```bash
npm run lint
npx tsc --noEmit
npm test -- --runInBand
npm run build
```
