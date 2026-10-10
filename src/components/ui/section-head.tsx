export function SectionHead({
  eyebrow,
  title,
  lead,
  balance,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  balance?: boolean;
}) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-end gap-x-12 gap-y-6">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2
          className={`mt-4 mb-0 text-[clamp(34px,4vw,54px)] leading-[.98] font-bold tracking-[-.035em] ${balance ? "text-balance" : ""}`}
        >
          {title}
        </h2>
      </div>
      {lead && <p className="m-0 max-w-[480px] text-lg leading-normal text-ink-2 text-pretty">{lead}</p>}
    </div>
  );
}
