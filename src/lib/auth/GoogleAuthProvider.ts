// src/lib/auth/GoogleAuthProvider.ts

import GoogleProvider from "next-auth/providers/google";
import { AuthProvider } from "./AuthProvider";

/**
 * Encapsulates all Google authentication configuration.
 *
 * Instead of defining the Google provider directly inside route.ts,
 * this class is responsible for creating and configuring it.
 *
 * This demonstrates:
 * - Inheritance
 * - Encapsulation
 * - Separation of concerns
 */
export class GoogleAuthProvider extends AuthProvider<
  ReturnType<typeof GoogleProvider>
> {
  /**
   * The constructor receives everything this class needs in order
   * to configure Google authentication.
   */
  constructor(
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {
    super();
  }

  /**
   * Implements the abstract method from the parent class.
   *
   * Although every authentication class exposes createProvider(),
   * each provider creates something different. This is an example
   * of polymorphism.
   */
  createProvider(): ReturnType<typeof GoogleProvider> {
    return GoogleProvider({
      clientId: this.clientId,
      clientSecret: this.clientSecret,
    });
  }
}