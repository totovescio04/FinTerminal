import { redirect } from "next/navigation";

/** The app opens on the dashboard. */
export default function HomePage() {
  redirect("/dashboard");
}
