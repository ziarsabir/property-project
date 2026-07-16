import { AuthProvider } from "./AuthProvider";

export class CredentialsAuthProvider extends AuthProvider {
  createProvider(): unknown {
    throw new Error("Credentials provider not implemented yet");
  }
}