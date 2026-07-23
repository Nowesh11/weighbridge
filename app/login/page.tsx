"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (!res || res.error) {
      setError("Invalid username or password.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-graphite-900 px-4">
      <div className="w-full max-w-sm rounded-sm border border-line bg-white p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-sm bg-amber-500 font-display text-xl font-bold text-graphite-900">
            W
          </span>
          <p className="font-display text-xl font-semibold text-ink">Weighbridge Ticketing</p>
          <p className="text-sm text-graphite-700">Sign in to continue</p>
        </div>

        {error && (
          <div className="mb-4 rounded-sm border border-signal-red/40 bg-signal-red/10 px-3 py-2 text-sm text-signal-red">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block font-display text-[13px] font-semibold uppercase tracking-wide text-graphite-700">
              Username
            </label>
            <input
              className="w-full rounded-sm border border-line px-3 py-2 text-sm text-ink shadow-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              required
            />
          </div>
          <div>
            <label className="mb-1 block font-display text-[13px] font-semibold uppercase tracking-wide text-graphite-700">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-sm border border-line px-3 py-2 text-sm text-ink shadow-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-sm bg-amber-500 px-4 py-2 font-display text-sm font-semibold uppercase tracking-wide text-graphite-900 transition hover:bg-amber-600 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
