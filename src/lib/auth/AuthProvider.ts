// This is the parent class. It says that every child auth class must provide a createProvider() method. 

export abstract class AuthProvider {
  abstract createProvider(): unknown;
}