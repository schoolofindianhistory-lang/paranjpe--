import { createFileRoute, redirect } from "@/lib/navigation";

export const Route = createFileRoute("/stories")({
  beforeLoad: () => {
    throw redirect({ to: "/blog" });
  },
  component: StoriesRedirect,
});

function StoriesRedirect() {
  return null;
}
