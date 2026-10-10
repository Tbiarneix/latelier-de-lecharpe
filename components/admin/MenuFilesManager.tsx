"use client";

import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { deleteMenuFile, registerMenuFile } from "@/app/admin/(panel)/cartes/actions";
import { Card, ConfirmButton, FormMessage, inputClass, type FormState } from "@/components/admin/ui";

type Category = "brunch" | "diner" | "fiesta";
type MenuFile = { id: number; category: Category; url: string; pathname: string; mimeType: string };

const CATEGORIES: { key: Category; label: string }[] = [
  { key: "diner", label: "Dîner" },
  { key: "fiesta", label: "Fiesta" },
  { key: "brunch", label: "Brunch" },
];
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX_BYTES = 15 * 1024 * 1024;

function fileLabel(f: MenuFile) {
  const name = f.pathname.split("/").pop() ?? f.pathname;
  return `${f.mimeType === "application/pdf" ? "PDF" : "Image"} — ${name}`;
}

function CategoryBlock({
  category,
  label,
  files,
  mode,
  onDeleted,
}: {
  category: Category;
  label: string;
  files: MenuFile[];
  mode: "blob" | "local" | "none";
  onDeleted: (state: FormState) => void;
}) {
  const router = useRouter();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<FormState>(null);

  async function uploadOne(file: File) {
    if (!ALLOWED.includes(file.type)) throw new Error(`« ${file.name} » : type de fichier non accepté.`);
    if (file.size > MAX_BYTES) throw new Error(`« ${file.name} » : fichier trop volumineux (15 Mo maximum).`);

    let url: string;
    let pathname: string;
    if (mode === "blob") {
      const blob = await upload(`menus/${category}/${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/blob",
      });
      ({ url, pathname } = blob);
    } else {
      const body = new FormData();
      body.set("file", file);
      const res = await fetch("/api/admin/menu-upload", { method: "POST", body });
      const json = await res.json();
      if (!res.ok) throw new Error(`« ${file.name} » : ${json.error ?? "envoi impossible"}`);
      ({ url, pathname } = json);
    }

    const result = await registerMenuFile({
      category,
      url,
      pathname,
      mimeType: file.type as "image/jpeg" | "image/png" | "image/webp" | "application/pdf",
    });
    if (!result?.ok) throw new Error(`« ${file.name} » : ${result?.message ?? "enregistrement impossible"}`);
  }

  async function onChange() {
    const selected = Array.from(inputRef.current?.files ?? []);
    if (selected.length === 0) return;

    setBusy(true);
    let done = 0;
    try {
      for (const file of selected) {
        setStatus({ ok: true, message: `Envoi de « ${file.name} » (${done + 1} sur ${selected.length})…` });
        await uploadOne(file);
        done++;
      }
      setStatus({ ok: true, message: done > 1 ? `${done} fichiers ajoutés.` : "Fichier ajouté." });
    } catch (err) {
      setStatus({ ok: false, message: (err as Error).message });
    } finally {
      if (inputRef.current) inputRef.current.value = "";
      setBusy(false);
      router.refresh();
    }
  }

  return (
    <Card>
      <h2 className="mb-4 font-specialElite text-2xl">Carte {label.toLowerCase()}</h2>

      <div className="mb-6">
        <label htmlFor={inputId} className="mb-1 block font-semibold">
          Ajouter des fichiers
        </label>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          multiple
          accept={ALLOWED.join(",")}
          disabled={busy || mode === "none"}
          onChange={onChange}
          className={`${inputClass} file:mr-4 file:rounded-md file:border-0 file:bg-blueDark file:px-3 file:py-1 file:font-semibold file:text-cream`}
        />
        <div aria-live="polite" aria-busy={busy} className={status?.ok ? "mt-2" : "sr-only"}>
          {status?.ok ? status.message : ""}
        </div>
        <div role="alert" className={status && !status.ok ? "mt-2 font-semibold text-redWine" : "sr-only"}>
          {status && !status.ok ? status.message : ""}
        </div>
      </div>

      <h3 className="mb-2 font-semibold">Fichiers actuellement affichés</h3>
      {files.length === 0 ? (
        <p>Aucun fichier : la page affiche « Aucun menu disponible pour le moment. »</p>
      ) : (
        <ol className="flex flex-col gap-3">
          {files.map((f, i) => (
            <li key={f.id} className="flex flex-wrap items-center justify-between gap-3">
              <span>
                <span className="font-semibold">{i + 1}.</span>{" "}
                <a
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blueLight"
                >
                  {fileLabel(f)}
                  <span className="sr-only"> (s&apos;ouvre dans un nouvel onglet)</span>
                </a>
              </span>
              <ConfirmButton
                label={`Supprimer le fichier ${i + 1} de la carte ${label.toLowerCase()}`}
                onConfirm={async () => {
                  onDeleted(await deleteMenuFile(f.id));
                  router.refresh();
                }}
              >
                Supprimer
              </ConfirmButton>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}

export default function MenuFilesManager({ files, mode }: { files: MenuFile[]; mode: "blob" | "local" | "none" }) {
  const [deleteState, setDeleteState] = useState<FormState>(null);

  return (
    <div className="flex flex-col gap-8">
      <FormMessage state={deleteState} />
      {CATEGORIES.map(({ key, label }) => (
        <CategoryBlock
          key={key}
          category={key}
          label={label}
          mode={mode}
          files={files.filter((f) => f.category === key)}
          onDeleted={setDeleteState}
        />
      ))}
    </div>
  );
}
