import { KarFisiApp } from "@/components/kar-fisi-app";
import rates from "@data/komisyon-oranlari.json";
import type { RatesData } from "@/lib/types";

export default function Page() {
  return <KarFisiApp rates={rates as RatesData} />;
}
