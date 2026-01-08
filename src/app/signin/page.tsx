"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function SignInPage() {
  const { status, data } = useSession();

  const loading = status === "loading";
  const authed = status === "authenticated";

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Sign in</h1>
      <p className="mt-1 text-sm text-slate-600">
        Sign in to save properties and manage enquiries.
      </p>

      <div className="mt-6 space-y-4 rounded-xl border bg-white p-6 shadow-sm">
        {loading ? (
          <p className="text-sm text-slate-600">Checking session…</p>
        ) : authed ? (
          <>
            <div className="rounded-lg border bg-slate-50 p-4">
              <p className="text-sm text-slate-700">
                Signed in as{" "}
                <span className="font-medium">{data?.user?.email}</span>
              </p>
            </div>

            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/signin" })}
              className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/search" })}
              className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Continue with Google
            </button>

            <p className="text-xs text-slate-500">
              (Email/password login isn’t enabled in this MVP.)
            </p>
          </>
        )}
      </div>
    </main>
  );
}