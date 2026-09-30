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

// Create the Cosmos-specific implementation of the UserRepository interface
const userRepository = new CosmosUserRepository();

// Pass the repository into the service layer.
// UserService depends on the UserRepository abstraction rather than directly on Cosmos DB.
const userService = new UserService(userRepository);

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
     * If the authenticated user does not already exist in storage,
     * a new User record is created and saved.
     */
    async signIn({ user, account }) {
      // I need both an email and name to create a persisted application user
      if (!user.email || !user.name) {
        return false;
      }

      // Determine whether the user authenticated with Google or credentials
      const authProvider =
        account?.provider === "google" ? "google" : "credentials";

      // Delegate the user lookup / creation logic to the service layer
      await userService.getOrCreateUser({
        id: user.id,
        name: user.name,
        email: user.email,
        authProvider,

        // A credentials user requires the existing hashed demo password.
        // A Google user does not need a password hash because Google handles authentication.
        passwordHash:
          authProvider === "credentials"
            ? demoUserPasswordHash
            : undefined,
      });

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