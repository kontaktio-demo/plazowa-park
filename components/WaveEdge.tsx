/**
 * Przejście między pasmami maską fali. Element leży na górze sekcji docelowej
 * i jest wypełniony kolorem sekcji poprzedniej, więc granica jest cięta falą,
 * a nie prostą. Jedna warstwa, niska amplituda - na stronie użyte trzy razy.
 */
export default function WaveEdge({ from }: { from: string }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[clamp(32px,4.5vw,72px)] overflow-hidden"
      style={{ color: from }}
    >
      <svg viewBox="0 0 1440 64" preserveAspectRatio="none" className="h-full w-full" fill="currentColor">
        <path d="M0 0h1440v28c-240 26-480-18-720 0S240 54 0 30Z" />
      </svg>
    </div>
  );
}
