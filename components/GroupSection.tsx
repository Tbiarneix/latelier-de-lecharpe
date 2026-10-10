import React from "react";
import FormuleCard from "@/components/FormuleCard";
import { getActiveFormules } from "@/lib/data";

export default async function GroupSection() {
  const formules = await getActiveFormules();

  if (formules.length === 0) return null;

  return (
    <div className="w-screen bg-blueLight flex flex-col justify-center items-center py-20">
      <h2 className="w-11/12 text-center leading-none text-3xl text-mustard font-specialElite tracking-wide">
        Nos formules de groupe
      </h2>

      <p className="font-specialElite text-center mt-8 w-3/5 text-mustard">
        Les formules sont obligatoires à partir de 14 personnes. La totalité des convives doivent sélectionner la même formule.
      </p>

      <div className="lg:w-3/5 w-4/5 flex flex-col justify-between items-center py-12 space-y-4">
        {formules.map(f => (
          <FormuleCard
            key={f.id}
            nom={f.nom}
            prix={f.prix}
            description={f.description}
            elements={f.elements}
          />
        ))}
      </div>
    </div>
  );
}
