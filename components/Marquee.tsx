const DEFAULT = [
  "Apartamenty nad Zalewem Mrożyczka",
  "20 apartamentów",
  "prywatny ogród i taras",
  "ponad 100-letni las",
  "Głowno",
];

export default function Marquee({
  items = DEFAULT,
  reverse = false,
  duration = 56,
}: {
  items?: string[];
  reverse?: boolean;
  duration?: number;
}) {
  return (
    <div className="bd overflow-hidden border-y py-3.5" aria-hidden>
      <div
        className={`flex w-max will-change-transform ${reverse ? "marquee-x-rev" : "marquee-x"}`}
        style={{ animationDuration: `${duration}s` }}
      >
        <Row items={items} />
        <Row items={items} />
      </div>
    </div>
  );
}

function Row({ items }: { items: string[] }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden>
      {items.map((t, i) => (
        <span key={i} className="flex items-center gap-6 pl-6">
          <span className="t-meta whitespace-nowrap text-[clamp(0.6875rem,1.4vw,0.8125rem)]">{t}</span>
          <span className="h-1 w-1 flex-none rounded-full bg-lake-300" />
        </span>
      ))}
    </div>
  );
}
