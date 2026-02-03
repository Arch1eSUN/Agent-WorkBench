import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md glass glass-highlight glass-grain p-6">
        <div className="ui-title">Create account</div>
        <div className="ui-subtitle mt-1">A minimal registration form (UI-first).</div>

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
            Create
          </button>

          <div className="ui-micro text-white/50">
            Already have an account?{" "}
            <Link className="underline decoration-white/30 hover:decoration-white/60" href="/login">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
