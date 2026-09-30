// POST /api/saved-properties

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { CosmosUserRepository } from "@/repositories/CosmosUserRepository";
import { UserService } from "@/services/UserService";

// Create the Cosmos-specific implementation of the UserRepository interface
const userRepository = new CosmosUserRepository();

// Pass the repository into the service layer.
// UserService depends on the UserRepository abstraction rather than directly on Cosmos DB.
const userService = new UserService(userRepository);

// Save a property ID
export async function POST(req: Request) {
  // Get the currently authenticated user's NextAuth session
  const session = await getServerSession();

  // Prevent an unauthenticated user from saving a property
  if (!session?.user?.email) {
    return NextResponse.json(
      { ok: false, error: "You must be signed in to save a property" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const { listingId } = body || {};

  if (!listingId) {
    return NextResponse.json(
      { ok: false, error: "listingId is required" },
      { status: 400 }
    );
  }

  // Delegate the user lookup, domain behaviour and persistence to the service layer
  const user = await userService.savePropertyForUser(
    session.user.email,
    listingId
  );

  // The authenticated user should already exist in my persistence layer
  if (!user) {
    return NextResponse.json(
      { ok: false, error: "User account was not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { ok: true, received: { listingId } },
    { status: 200 }
  );
}

// GET /api/saved-properties - return the saved property IDs for the authenticated user
export async function GET() {
  // Get the currently authenticated user's NextAuth session
  const session = await getServerSession();

  // Prevent an unauthenticated user from accessing saved property data
  if (!session?.user?.email) {
    return NextResponse.json(
      { ok: false, error: "You must be signed in to view saved properties" },
      { status: 401 }
    );
  }

  // Delegate the user lookup to the service layer
  const savedPropertyIds = await userService.getSavedPropertyIds(
    session.user.email
  );

  // The authenticated user should already exist in my persistence layer
  if (!savedPropertyIds) {
    return NextResponse.json(
      { ok: false, error: "User account was not found" },
      { status: 404 }
    );
  }

  // Return the property IDs that belong to this user's saved properties
  return NextResponse.json(
    {
      ok: true,
      savedPropertyIds,
    },
    { status: 200 }
  );
}

// DELETE /api/saved-properties - remove a saved property ID for the authenticated user
export async function DELETE(req: Request) {
  // Get the currently authenticated user's NextAuth session
  const session = await getServerSession();

  // Prevent an unauthenticated user from removing a saved property
  if (!session?.user?.email) {
    return NextResponse.json(
      { ok: false, error: "You must be signed in to remove a saved property" },
      { status: 401 }
    );
  }

  // Read the JSON request body sent by the frontend
  const body = await req.json();

  // Extract the property ID that the user wants to remove
  const { listingId } = body || {};

  // Make sure a property ID was supplied
  if (!listingId) {
    return NextResponse.json(
      { ok: false, error: "listingId is required" },
      { status: 400 }
    );
  }

  // Delegate the user lookup, domain behaviour and persistence to the service layer
  const user = await userService.removeSavedPropertyForUser(
    session.user.email,
    listingId
  );

  // The authenticated user should already exist in my persistence layer
  if (!user) {
    return NextResponse.json(
      { ok: false, error: "User account was not found" },
      { status: 404 }
    );
  }

  // Return a successful response containing the property ID that was removed
  return NextResponse.json(
    { ok: true, removed: { listingId } },
    { status: 200 }
  );
}