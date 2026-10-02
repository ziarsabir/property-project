"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [registrationError, setRegistrationError] = useState<string | null>(
    null
  );

  const [registrationLoading, setRegistrationLoading] = useState(false);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setRegistrationError(null);
    setRegistrationLoading(true);

    try {
      // Send the new user's registration details to the registration API
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      // Display the error returned by the registration API
      if (!response.ok) {
        setRegistrationError(data?.error || "Unable to register.");
        return;
      }

      // Send the newly registered user to the sign-in page
      router.push("/signin");
    } catch {
      setRegistrationError("Unable to register. Please try again.");
    } finally {
      setRegistrationLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">
        Create account
      </h1>

      <p className="mt-1 text-sm text-slate-600">
        Register to save properties and manage your account.
      </p>

      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700"
            >
              Name
            </label>

            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>

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
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          {registrationError && (
            <p className="text-sm text-red-600">
              {registrationError}
            </p>
          )}

          <button
            type="submit"
            disabled={registrationLoading}
            className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {registrationLoading
              ? "Creating account..."
              : "Create account"}
          </button>
        </form>
      </div>
    </main>
  );
}