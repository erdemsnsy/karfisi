"use client";

import { useEffect, useRef } from "react";
import { useApp } from "../app-provider";
import { GuideModal } from "./guide-modal";
import { LegalModal } from "./legal-modal";
import { ProfileModal } from "./profile-modal";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal() {
  const { modal, closeModal } = useApp();
  const dialogRef = useRef<HTMLDivElement>(null);

  /* Erişilebilirlik: odak modala girer, Tab içeride döner, Esc kapatır, kapanınca odak geri döner */
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    dialog?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
        return;
      }
      if (e.key !== "Tab" || !dialog) return;
      const items = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [closeModal]);

  return (
    <div
      onClick={closeModal}
      className="fixed inset-0 z-100 flex items-center justify-center bg-ink/55 p-5 backdrop-blur-[6px]"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={modal === "guide" ? "Komisyon rehberi" : modal === "legal" ? "Yasal metin" : "Kayıtlı fişlerin"}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className={`relative max-h-[90vh] w-full overflow-auto rounded-[22px] bg-card p-[clamp(24px,4vw,36px)] text-ink shadow-[0_40px_100px_rgba(0,0,0,.35)] ${
          modal === "guide" ? "max-w-[620px]" : "max-w-[480px]"
        }`}
      >
        <button
          onClick={closeModal}
          aria-label="Kapat"
          className="absolute top-4 right-4 size-9 rounded-full border border-ink/[.18] bg-transparent text-base hover:bg-ink hover:text-paper"
        >
          ✕
        </button>
        {modal === "profile" && <ProfileModal />}
        {modal === "guide" && <GuideModal />}
        {modal === "legal" && <LegalModal />}
      </div>
    </div>
  );
}
