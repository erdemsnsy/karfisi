"use client";

import { Bulk } from "./bulk";
import { Faq } from "./faq";
import { Footer } from "./footer";
import { Header } from "./header";
import { HeroCalculator } from "./hero-calculator";
import { HowItWorks } from "./how-it-works";
import { PlatformStrip } from "./platform-strip";
import { Pricing } from "./pricing";

export function SiteView() {
  return (
    <>
      <Header />
      <main>
        <HeroCalculator />
        <PlatformStrip />
        <HowItWorks />
        <Bulk />
        <Faq />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
