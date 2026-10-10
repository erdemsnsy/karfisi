"use client";

import { useApp } from "../app-provider";

export function Toast() {
  const { toast, isMobile, hasPrice, rcptVis } = useApp();
  if (!toast) return null;
  const raised = isMobile && hasPrice && !rcptVis;
  return (
    <div
      role="status"
      className="fixed left-1/2 z-200 flex -translate-x-1/2 items-center gap-2.5 rounded-full bg-ink px-5 py-[13px] font-mono text-[13px] whitespace-nowrap text-paper shadow-[0_14px_40px_rgba(0,0,0,.3)]"
      style={{ bottom: raised ? "92px" : "28px" }}
    >
      <span className="size-[7px] rounded-full bg-accent-light" />
      {toast}
    </div>
  );
}
