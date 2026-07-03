import { HARMONOGRAM } from "@/lib/data/site";
import { Icon } from "./Icons";

const doneCount = HARMONOGRAM.filter((s) => s.state === "done").length;
const progress = Math.round(((doneCount + 0.5) / HARMONOGRAM.length) * 100);

export default function Harmonogram() {
  return (
    <section id="postep" className="bg-paper py-20 sm:py-28">
      <div className="container-x">
        <header className="flex flex-wrap items-end justify-between gap-4" data-reveal="up">
          <div className="max-w-2xl">
            <p className="eyebrow">Postęp budowy</p>
            <h2 className="mt-5 text-[clamp(2rem,4.4vw,3.4rem)] text-pine">
              Inwestycja <span className="italic text-brass-deep">na finiszu.</span>
            </h2>
          </div>
          <div className="text-right">
            <div className="font-display text-4xl text-pine num">{progress}%</div>
            <div className="text-xs uppercase tracking-[0.14em] text-muted">zaawansowania</div>
          </div>
        </header>

        {/* progress rail */}
        <div className="mt-10 h-1.5 w-full overflow-hidden rounded-full bg-sand-deep/60" data-reveal="fade">
          <div className="h-full rounded-full bg-gradient-to-r from-moss to-pine" style={{ width: `${progress}%` }} />
        </div>

        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5" data-reveal="up">
          {HARMONOGRAM.map((s) => (
            <li
              key={s.period}
              className={`rounded-[14px] border p-5 ${
                s.state === "current"
                  ? "border-pine bg-pine text-paper shadow-[var(--shadow-soft)]"
                  : "border-ink/10 bg-paper-2"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold uppercase tracking-[0.12em] ${s.state === "current" ? "text-brass-light" : "text-brass-deep"}`}>
                  {s.period}
                </span>
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full ${
                    s.state === "done" ? "bg-moss text-white" : s.state === "current" ? "bg-brass-light text-pine-deep" : "border border-ink/20 text-faint"
                  }`}
                >
                  {s.state === "done" ? <Icon.check width={14} height={14} /> : s.state === "current" ? <span className="h-2 w-2 rounded-full bg-pine-deep" /> : ""}
                </span>
              </div>
              <p className={`mt-3 font-display text-lg ${s.state === "current" ? "text-paper" : "text-pine"}`}>{s.title}</p>
              <p className={`mt-1 text-xs ${s.state === "current" ? "text-paper/70" : "text-muted"}`}>
                {s.state === "done" ? "Zrealizowane" : s.state === "current" ? "W toku" : "Planowane"}
              </p>
            </li>
          ))}
        </ol>
        <p className="mt-5 text-xs text-faint">Harmonogram poglądowy. Aktualny status prac potwierdza biuro sprzedaży.</p>
      </div>
    </section>
  );
}
