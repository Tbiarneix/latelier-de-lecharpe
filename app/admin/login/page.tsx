import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { getSession } from "@/lib/admin-session";

export const metadata: Metadata = { title: "Connexion" };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await getSession()) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-xl bg-redWine p-6 text-cream sm:p-8">
        <h1 className="mb-6 font-specialElite text-2xl">Connexion à l&apos;administration</h1>
        <LoginForm />
      </div>
    </main>
  );
}
