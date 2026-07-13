// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;

const demoUserEmail = process.env.DEMO_USER_EMAIL;
const demoUserPasswordHash = process.env.DEMO_USER_PASSWORD_HASH;

if (!googleClientId || !googleClientSecret) {
  throw new Error("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET");
}

if (!nextAuthSecret) {
  throw new Error("Missing NEXTAUTH_SECRET");
}

if (!demoUserEmail || !demoUserPasswordHash) {
  throw new Error(
    "Missing DEMO_USER_EMAIL or DEMO_USER_PASSWORD_HASH"
  );
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),

    CredentialsProvider({
      name: "Email and password",

      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "test@example.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;

        if (!email || !password) {
          return null;
        }

        if (email !== demoUserEmail.toLowerCase()) {
          return null;
        }

        const passwordMatches = await compare(
          password,
          demoUserPasswordHash
        );

        if (!passwordMatches) {
          return null;
        }

        return {
          id: "demo-user-1",
          name: "Demo User",
          email: demoUserEmail,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/signin",
  },

  secret: nextAuthSecret,

  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
});

export { handler as GET, handler as POST };