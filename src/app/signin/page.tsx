"use client";

import { FormEvent, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function SignInPage() {
  const { status, data } = useSession();

  console.log(data); 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [credentialsError, setCredentialsError] = useState<string | null>(
    null
  );
  const [credentialsLoading, setCredentialsLoading] = useState(false);

  const loading = status === "loading";
  const authed = status === "authenticated";

  async function handleCredentialsSignIn(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setCredentialsError(null);
    setCredentialsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/search",
      });

      if (!result?.ok) {
        setCredentialsError("Incorrect email or password.");
        return;
      }

      window.location.href = result.url ?? "/search";
    } catch {
      setCredentialsError("Unable to sign in. Please try again.");
    } finally {
      setCredentialsLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Sign in</h1>

      <p className="mt-1 text-sm text-slate-600">
        Sign in to save properties and manage enquiries.
      </p>

      <div className="mt-6 space-y-5 rounded-xl border bg-white p-6 shadow-sm">
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
              onClick={() =>
                signIn("google", { callbackUrl: "/search" })
              }
              className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Continue with Google
            </button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs text-slate-500">or</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <form
              onSubmit={handleCredentialsSignIn}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                />
              </div>

              {credentialsError && (
                <p className="text-sm text-red-600">
                  {credentialsError}
                </p>
              )}

              <button
                type="submit"
                disabled={credentialsLoading}
                className="w-full rounded-lg border border-slate-900 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-60"
              >
                {credentialsLoading
                  ? "Signing in…"
                  : "Sign in with email"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}