import { createFileRoute, redirect, useNavigate, useRouter } from "@/lib/navigation";
import { useState } from "react";
import { LockKeyhole, LogIn } from "lucide-react";
import { getAdminSessionState, loginAdmin } from "@/lib/content.functions";

export const Route = createFileRoute("/admin/login")({
  loader: async () => {
    const session = await getAdminSessionState();
    if (session.authenticated) {
      throw redirect({ to: "/admin" });
    }

    return session;
  },
  head: () => ({
    meta: [{ title: "Admin Login - Paranjape Tours" }],
    
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await loginAdmin({
        data: {
          username,
          password,
        },
      });
      await router.invalidate();
      await navigate({ to: "/admin" });
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Unable to sign in right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(196,151,60,0.18),transparent_35%),linear-gradient(180deg,#fbf6ef_0%,#f6efe5_48%,#f1e7d7_100%)] px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-white/60 bg-white/75 p-8 shadow-[var(--shadow-elegant)] backdrop-blur md:p-10">
            <span className="section-eyebrow">Admin Access</span>
            <h1 className="mt-4 font-serif text-4xl text-primary md:text-5xl">
              Manage tours, blogs, books and testimonials.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-foreground/80">
              This dashboard writes to MySQL and updates the existing frontend without removing the
              current design or legacy tour pages.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-border bg-card p-8 shadow-[var(--shadow-soft)] md:p-10"
          >
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-soft)]">
              <LockKeyhole size={24} />
            </div>
            <h2 className="mt-6 font-serif text-3xl text-primary">Sign in</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Use the admin credentials configured for this project.
            </p>

            <div className="mt-8 space-y-5">
              <Field
                label="Username"
                value={username}
                onChange={setUsername}
                autoComplete="username"
                required
              />
              <Field
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <div className="mt-5 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <LogIn size={16} />
              {isSubmitting ? "Signing in..." : "Sign in to dashboard"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        required={required}
        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
    </div>
  );
}
