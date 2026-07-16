import { AuthProvider } from "./AuthProvider";

export class GoogleAuthProvider extends AuthProvider {
    // The same method will eventually behave differently in each class, which is polymorphism.
  createProvider(): unknown {
    throw new Error("Google provider not implemented yet");
  }
} 