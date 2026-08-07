"use client"; 

/**
 * AuthControls displays the correct authentication option
 * based on the user's current session.
 *
 * If the user is signed out, it displays a Sign In link.
 * If the user is signed in, it displays a Sign Out button.
 *
 * This is a Client Component because it uses NextAuth's
 * useSession() hook (which tells the component whether the user is currently signed in) and signOut() function.
 */

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function AuthControls() {
  // Will use the status to decide what the component renders 
  const { status } = useSession();

  // Wait until NextAuth has finished checking for an existing session 
  if (status === "loading") {
  return null;
  }   

// If a valid session exists, allow the user to sign out 
  if (status === "authenticated") {
    return (
        <button
            onClick={() => signOut()}
            className="rounded-md border px-3 py-1 font-medium hover:bg-slate-100 transition"
        >
            Sign Out 
        </button>
    )
  }

  // Otherwise the user is unauthenticated, so allow them to sign in 
  return (
    <Link
        href="/signin"
        className="rounded-md border px-3 py-1 font-medium hover:bg-slate-100 transition"
    >
        Sign in 
    </Link>
  )

}

