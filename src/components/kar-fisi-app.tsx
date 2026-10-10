"use client";

import type { RatesData } from "@/lib/types";
import { AppProvider, useApp } from "./app-provider";
import { Checkout } from "./checkout/checkout";
import { Done } from "./checkout/done";
import { Modal } from "./modals/modal";
import { MobileBar } from "./site/mobile-bar";
import { SiteView } from "./site/site-view";
import { Toast } from "./ui/toast";

function Shell() {
  const { view, modal } = useApp();
  return (
    <>
      {view === "site" && <SiteView />}
      {view === "checkout" && <Checkout />}
      {view === "done" && <Done />}
      {modal && <Modal />}
      <MobileBar />
      <Toast />
    </>
  );
}

export function KarFisiApp({ rates }: { rates: RatesData }) {
  return (
    <AppProvider rates={rates}>
      <Shell />
    </AppProvider>
  );
}
