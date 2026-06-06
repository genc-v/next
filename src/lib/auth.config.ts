import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

// Edge-compatible auth config — no Node.js-only imports (mongoose, bcrypt, etc.)
// The actual authorize/signIn logic that needs Node.js lives in auth.ts
export default {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Credentials must be declared here so NextAuth knows the provider exists,
    // but the authorize function is overridden in auth.ts (Node.js runtime).
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize() {
        // Stub — real implementation is in auth.ts
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnProfile = nextUrl.pathname.startsWith("/profile");
      const isOnFavorites = nextUrl.pathname.startsWith("/favorites");
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnUrls = nextUrl.pathname.startsWith("/urls");

      if ((isOnDashboard || isOnProfile || isOnFavorites || isOnAdmin || isOnUrls) && !isLoggedIn) {
        return false;
      }

      if (isOnAdmin && auth?.user?.role !== "admin") {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
