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
  duration = 34,
  dark = false,
}: {
  items?: string[];
  reverse?: boolean;
  duration?: number;
  dark?: boolean;
}) {
  const Row = () => (
    <div className="flex shrink-0 items-center" aria-hidden>
      {items.map((t, i) => (
        <span key={i} className="flex items-center">
          <span className="whitespace-nowrap px-6 font-display text-[clamp(1.15rem,2.4vw,2rem)] font-medium uppercase tracking-[0.02em]">
            {t}
          </span>
          <span className={`text-[clamp(0.8rem,1.6vw,1.2rem)] ${dark ? "text-brass-light" : "text-brass"}`}>✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={`overflow-hidden border-y py-4 sm:py-5 ${dark ? "border-paper/12 bg-pine-deep text-paper" : "border-ink/10 bg-paper text-pine"}`}
      aria-hidden
    >
      <div className={`flex w-max ${reverse ? "marquee-x-rev" : "marquee-x"}`} style={{ animationDuration: `${duration}s` }}>
        <Row />
        <Row />
      </div>
    </div>
  );
}
