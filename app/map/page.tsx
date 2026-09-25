import type { Metadata } from "next";
import { MapExplorer } from "@/components/MapExplorer";
import { PageTitle } from "@/components/L";

export const metadata: Metadata = { title: "Map of free help" };

export default function MapPage() {
  return (
    <>
      <PageTitle
        en="Map of free help in Texas"
        es="Mapa de ayuda gratis en Texas"
        introEn="Churches, libraries, shelters, food, showers, and clinics. Pick a type to see just those places."
        introEs="Iglesias, bibliotecas, refugios, comida, duchas y clínicas. Elija un tipo para ver solo esos lugares."
      />
      <MapExplorer />
    </>
  );
}
