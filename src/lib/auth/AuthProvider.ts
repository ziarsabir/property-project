// src/lib/auth/AuthProvider.ts

/**
 * Parent authentication class.
 *
 * Every authentication provider in the application should inherit
 * from this class and implement createProvider().
 *
 * This gives each provider a common structure while allowing
 * different authentication methods (Google, Credentials, etc.)
 * to have their own implementation.
 */

export abstract class AuthProvider<TProvider> {
  /**
   * Each child class must return its configured NextAuth provider.
   */
  abstract createProvider(): TProvider;
}