"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function NavBar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (pathname === "/login") return null;

  return (
    <div className="no-print sticky top-0 z-20 border-b border-line bg-graphite-900 text-steel-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-amber-500 font-display text-lg font-bold text-graphite-900">
            W
          </span>
          <div className="leading-tight">
            <p className="font-display text-lg font-semibold tracking-wide">Weighbridge Ticketing</p>
            <p className="text-[11px] uppercase tracking-[0.15em] text-steel-300 font-bold">MT SMART</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-1 font-display text-sm uppercase tracking-wide">
            <Link
              href="/"
              className="rounded-sm px-4 py-2 text-steel-100 transition hover:bg-graphite-700 hover:text-white"
            >
              New Ticket
            </Link>
            <Link
              href="/receipts"
              className="rounded-sm px-4 py-2 text-steel-100 transition hover:bg-graphite-700 hover:text-white"
            >
              Records
            </Link>
          </nav>
          {session?.user?.name && (
            <div className="flex items-center gap-2 border-l border-graphite-700 pl-4">
              <span className="text-xs text-steel-300">
                Signed in as <span className="font-semibold text-steel-100">{session.user.name}</span>
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="rounded-sm border border-graphite-700 px-3 py-1.5 font-display text-xs font-semibold uppercase tracking-wide text-steel-100 transition hover:bg-graphite-700 hover:text-white"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
