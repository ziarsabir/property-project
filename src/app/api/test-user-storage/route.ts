import { NextResponse } from "next/server";
import { User } from "@/models/User";
import { saveUser, loadUsers, updateUser } from "@/data/userStorage";

/**
 * Temporary API route used to test the user persistence pipeline.
 *
 * This creates a real User domain object and passes it to saveUser()
 * so we can confirm that the user's data is persisted to users.json.
 *
 * This route is only for development/testing and will be removed
 * once the persistence pipeline has been confirmed to work.
 */

export async function GET() {
  // Create a real instance of the User domain class
  const testUser = new User({
    id: "test-user-1",
    name: "Test User",
    email: "test@example.com",
    authProvider: "credentials",

    // This is only temporary test data.
    // A real application would store an actual hashed password here.
    passwordHash: "test-password-hash",
  });

  // Temporarily disabled so we don't save the same test user again
  // await saveUser(testUser);

  // Load the persisted records and reconstruct them as User domain objects
  const users = await loadUsers();

  // Get the Test User that we previously persisted
  const loadedUser = users.find((user) => user.id === "test-user-1");

  // Prove that the loaded user is a real User domain object
  // by calling a method defined on the User class
  loadedUser?.saveProperty("test-property-1");

  // Persist the User object's updated state back to users.json
  if (loadedUser) {
    await updateUser(loadedUser);
  }

  return NextResponse.json({
    ok: true,
    name: loadedUser?.name,
    savedPropertyIds: loadedUser?.savedPropertyIds,

    // Check whether the reconstructed object is genuinely an instance of User
    isUserInstance: loadedUser instanceof User,
  });
}