import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md glass glass-highlight glass-grain p-6">
        <div className="ui-title">Sign in</div>
        <div className="ui-subtitle mt-1">Welcome back. Use any email/password for now.</div>

        <form className="mt-5 space-y-3">
          <label className="block">
            <div className="ui-micro mb-1">Email</div>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-md border border-white/10 bg-black/25 px-3 py-2 ui-micro outline-none placeholder:text-white/35"
            />
          </label>
          <label className="block">
            <div className="ui-micro mb-1">Password</div>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-md border border-white/10 bg-black/25 px-3 py-2 ui-micro outline-none placeholder:text-white/35"
            />
          </label>

          <button
            type="button"
            className="pressable w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 ui-title"
          >
            Continue
          </button>

          <div className="ui-micro text-white/50">
            No account?{" "}
            <Link className="underline decoration-white/30 hover:decoration-white/60" href="/register">
              Create one
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
