import type { Metadata } from "next";
import PasswordForm from "@/components/admin/PasswordForm";
import SignOutButton from "@/components/admin/SignOutButton";
import { Card } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin-session";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth";

export const metadata: Metadata = { title: "Mon compte" };
export const dynamic = "force-dynamic";

export default async function ComptePage() {
  const { user } = await requireAdmin();

  return (
    <>
      <h1 className="mb-2 font-specialElite text-3xl">Mon compte</h1>
      <p className="mb-8">
        Connecté avec l&apos;adresse <strong>{user.email}</strong>.
      </p>

      <div className="flex flex-col gap-10">
        <Card>
          <h2 className="mb-4 font-specialElite text-2xl">Changer de mot de passe</h2>
          <PasswordForm minLength={MIN_PASSWORD_LENGTH} />
        </Card>

        <Card>
          <h2 className="mb-4 font-specialElite text-2xl">Déconnexion</h2>
          <SignOutButton />
        </Card>
      </div>
    </>
  );
}
