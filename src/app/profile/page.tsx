"use client";

// useSession gives this page access to the currently authenticated user's session
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function ProfilePage() {
  // Get the current user's session data and authentication status
  const { data: session, status } = useSession();

  // Show a temporary loading state while NextAuth checks the user's session
  if (status === "loading") {
    return (
      <div className="py-8">
        <p className="text-sm text-slate-500">Loading profile...</p>
      </div>
    );
  }

  // Prevent unauthenticated users from viewing the profile page
  if (status === "unauthenticated") {
    return (
      <div className="py-8">
        <h1 className="text-2xl font-bold">My profile</h1>

        <p className="mt-2 text-slate-600">
          Please sign in to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 
        PROFILE DASHBOARD HEADER

        The user's name comes from the current NextAuth session,
        so the greeting automatically changes depending on who is signed in.
      */}
      <section className="rounded-xl bg-slate-900 px-6 py-10 text-white">
        <h1 className="text-3xl font-bold">
          Hello {session?.user?.name}
        </h1>

        <p className="mt-2 text-slate-300">
          Everything you need to manage your property search, all in one place.
        </p>
      </section>

      {/*
        MY PROFILE CARD

        This displays the basic account information belonging to the
        currently authenticated user. The name and email are taken
        directly from the NextAuth session rather than being hard-coded.
      */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold text-slate-900">
            My profile
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your personal account details.
          </p>
        </div>

        {/* Display the user's basic account information */}
        <div className="divide-y">
          {/* User name */}
          <div className="py-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Name
            </p>

            <p className="mt-1 text-sm font-medium text-slate-900">
              {session?.user?.name || "Not provided"}
            </p>
          </div>

          {/* User email address */}
          <div className="py-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Email
            </p>

            <p className="mt-1 text-sm font-medium text-slate-900">
              {session?.user?.email || "Not provided"}
            </p>
          </div>
        </div>
      </section>

      {/*
        SAVED PROPERTIES

        This section will eventually display the Property objects that
        correspond to the property IDs saved by the current user.

        For now, I display an empty state until the user's saved property
        data is connected to the profile page.
      */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold text-slate-900">
            Saved properties
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Keep track of the properties you&apos;re interested in.
          </p>
        </div>

        {/* Empty state shown when the user has no saved properties */}
        <div className="py-10 text-center">
          <div className="text-3xl" aria-hidden="true">
            ♡
          </div>

          <h3 className="mt-3 text-base font-semibold text-slate-900">
            No saved properties yet
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Save properties that catch your eye and they&apos;ll appear here for
            easy access later.
          </p>

          <Link
            href="/search"
            className="mt-5 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Start searching
          </Link>
        </div>
      </section>

      {/*
        YOUR ENQUIRIES

        This section will eventually display property enquiries made by
        the authenticated user.

        The contact route currently sends enquiries through Resend but
        does not persist enquiry history, so for now this section displays
        an empty state rather than temporary or hard-coded enquiry data.
      */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold text-slate-900">
            Your enquiries
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Keep track of the properties you&apos;ve enquired about.
          </p>
        </div>

        {/* Empty state shown when there is no persisted enquiry history */}
        <div className="py-10 text-center">
          <div className="text-3xl" aria-hidden="true">
            ✉
          </div>

          <h3 className="mt-3 text-base font-semibold text-slate-900">
            No enquiries yet
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            When you enquire about a property, your enquiry history can appear
            here for easy access.
          </p>

          <Link
            href="/search"
            className="mt-5 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Search properties
          </Link>
        </div>
      </section>
    </div>
  );
}