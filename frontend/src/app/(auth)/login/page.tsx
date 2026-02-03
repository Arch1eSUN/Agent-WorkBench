import Link from "next/link";
import { Button, Input } from "@/components/ui";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md glass glass-highlight glass-grain p-6">
        <div className="ui-title">Sign in</div>
        <div className="ui-subtitle mt-1">Welcome back. Use any email/password for now.</div>

        <form className="mt-5 space-y-3">
          <label className="block">
            <div className="ui-micro mb-1">Email</div>
            <Input type="email" placeholder="you@example.com" />
          </label>
          <label className="block">
            <div className="ui-micro mb-1">Password</div>
            <Input type="password" placeholder="••••••••" />
          </label>

          <Button type="button">Continue</Button>

          <div className="ui-micro" style={{ color: "var(--text1)" }}>No account?{" "}
            <Link className="underline" style={{ textDecorationColor: "color-mix(in oklab, var(--text1) 35%, transparent)" }} href="/register">
              Create one
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
