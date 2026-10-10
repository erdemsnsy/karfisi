"use client";

import { useApp } from "../app-provider";
import { GuideModal } from "./guide-modal";
import { LegalModal } from "./legal-modal";
import { ProfileModal } from "./profile-modal";

export function Modal() {
  const { modal, closeModal } = useApp();

  return (
    <div
      onClick={closeModal}
      className="fixed inset-0 z-100 flex items-center justify-center bg-ink/55 p-5 backdrop-blur-[6px]"
    >
      <div
        role="dialog"
        aria-modal="true"
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
