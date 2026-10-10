/** Seçili / seçili değil chip sınıfları (tasarımdaki chip() yardımcısı) */
export const chipClass = (on: boolean) =>
  on ? "border-ink bg-ink text-paper" : "border-ink/[.22] bg-transparent text-ink";
