import { LockKeyhole } from "lucide-react";
import { Link, createFileRoute } from "@/lib/navigation";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [{ title: "Admin Disabled - Paranjape Tours" }],
  }),
  component: AdminDisabled,
});

function AdminDisabled() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(196,151,60,0.18),transparent_35%),linear-gradient(180deg,#fbf6ef_0%,#f6efe5_48%,#f1e7d7_100%)] px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl items-center justify-center">
        <div className="rounded-[2rem] border border-border bg-card p-8 text-center shadow-[var(--shadow-soft)] md:p-10">
          <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-soft)]">
            <LockKeyhole size={24} />
          </span>
          <h1 className="mt-6 font-serif text-3xl text-primary md:text-4xl">Admin dashboard disabled</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
            This deployment is now a React-only static website. The old server functions and MySQL admin
            CMS were removed from the frontend build.
          </p>
          <Link
            to="/"
            className="mt-7 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
