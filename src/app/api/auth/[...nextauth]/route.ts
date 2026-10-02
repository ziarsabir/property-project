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
import { CosmosUserRepository } from "@/repositories/CosmosUserRepository";
import { UserService } from "@/services/UserService";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;

if (!googleClientId || !googleClientSecret) {
  throw new Error("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET");
}

if (!nextAuthSecret) {
  throw new Error("Missing NEXTAUTH_SECRET");
}

// Create the Cosmos-specific implementation of the UserRepository interface
const userRepository = new CosmosUserRepository();

// Pass the repository into the service layer.
// UserService depends on the UserRepository abstraction rather than directly on Cosmos DB.
const userService = new UserService(userRepository);

const googleAuthProvider = new GoogleAuthProvider(
  googleClientId,
  googleClientSecret
);

// Pass the repository into the credentials provider so it can
// find registered users and validate their stored password hashes.
const credentialsAuthProvider = new CredentialsAuthProvider(
  userRepository
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
    /**
     * Runs when a user signs in successfully.
     *
     * This connects NextAuth authentication to my user persistence layer.
     * Google users are created in storage on their first successful sign-in.
     */
    async signIn({ user, account }) {
      // I need both an email and name to create a persisted application user
      if (!user.email || !user.name) {
        return false;
      }

      // Determine whether the user authenticated with Google or credentials
      const authProvider =
        account?.provider === "google" ? "google" : "credentials";

      // Google users may need an application user record created on their first sign-in
      if (authProvider === "google") {
        await userService.getOrCreateUser({
          id: user.id,
          name: user.name,
          email: user.email,
          authProvider,
        });
      }

      // Allow NextAuth to complete the successful sign-in
      return true;
    },

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