import { NextResponse } from "next/server";
import { CosmosUserRepository } from "@/repositories/CosmosUserRepository";
import { UserService } from "@/services/UserService";

// Create the Cosmos-specific repository implementation
const userRepository = new CosmosUserRepository();

// Pass the repository into the service layer
const userService = new UserService(userRepository);

// Register a new credentials user
export async function POST(req: Request) {
  // Read the registration details sent by the frontend
  const body = await req.json();

  const { name, email, password } = body || {};

  // Make sure all required registration fields were supplied
  if (!name || !email || !password) {
    return NextResponse.json(
      {
        ok: false,
        error: "Name, email and password are required",
      },
      { status: 400 }
    );
  }

  try {
    // Delegate the registration logic to the service layer
    const user = await userService.registerUser({
      name,
      email,
      password,
    });

    // Return the new user's non-sensitive information
    return NextResponse.json(
      {
        ok: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to register user";

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 409 }
    );
  }
}