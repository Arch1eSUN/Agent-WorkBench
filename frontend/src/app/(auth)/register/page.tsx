import Link from "next/link";
import { Button, Input } from "@/components/ui";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md glass glass-highlight glass-grain p-6">
        <div className="ui-title">Create account</div>
        <div className="ui-subtitle mt-1">A minimal registration form (UI-first).</div>

        <form className="mt-5 space-y-3">
          <label className="block">
            <div className="ui-micro mb-1">Email</div>
            <Input type="email" placeholder="you@example.com" />
          </label>
          <label className="block">
            <div className="ui-micro mb-1">Password</div>
            <Input type="password" placeholder="••••••••" />
          </label>

          <Button type="button">Create</Button>

          <div className="ui-micro" style={{ color: "var(--text1)" }}>Already have an account?{" "}
            <Link className="underline" style={{ textDecorationColor: "color-mix(in oklab, var(--text1) 35%, transparent)" }} href="/login">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
