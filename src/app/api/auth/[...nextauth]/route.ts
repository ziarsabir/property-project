/**
 * route.ts assembles the overall NextAuth configuration.
 *
 * Each authentication provider is responsible for creating and
 * configuring its own provider implementation. route.ts creates
 * instances of each provider, calls createProvider() on them,
 * and passes the configured providers into NextAuth.
 */

import NextAuth from "next-auth";
import { GoogleAuthProvider } from "@/lib/auth/GoogleAuthProvider";
import { CredentialsAuthProvider } from "@/lib/auth/CredentialsAuthProvider";

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

const googleAuthProvider = new GoogleAuthProvider(
  googleClientId,
  googleClientSecret
);

const credentialsAuthProvider = new CredentialsAuthProvider(
  demoUserEmail,
  demoUserPasswordHash
);

const handler = NextAuth({
  providers: [
    googleAuthProvider.createProvider(),
    credentialsAuthProvider.createProvider(),
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
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      if (new URL(url).origin === baseUrl) {
        return url;
      }

      return baseUrl;
    },
  },
});

export { handler as GET, handler as POST };