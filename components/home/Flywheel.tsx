/* The learning loop: brief → match → work → pulse, around "smarter next time". */
export function Flywheel({ steps, center }: { steps: string[]; center: string }) {
  const R = 130, C = 170;
  const pts = steps.map((_, i) => {
    const a = (i / steps.length) * Math.PI * 2 - Math.PI / 2;
    return { x: C + Math.cos(a) * R, y: C + Math.sin(a) * R };
  });
  return (
    <svg viewBox="0 0 340 340" className="mx-auto h-auto w-full max-w-[420px]" role="img" aria-label={`${steps.join(', ')}: ${center}`}>
      <circle cx={C} cy={C} r={R} fill="none" stroke="var(--border)" strokeWidth="1.5" />
      <circle cx={C} cy={C} r={R} fill="none" stroke="var(--thread)" strokeWidth="2" strokeDasharray="60 757"
        strokeLinecap="round" className="origin-center motion-safe:animate-[spin_9s_linear_infinite]" style={{ transformBox: 'fill-box' }} />
      <circle cx={C} cy={C} r="62" fill="var(--surface)" stroke="var(--border)" />
      <text x={C} y={C - 4} textAnchor="middle" className="fill-[var(--text)] font-display text-[15px] font-bold">
        {center.split(' ').slice(0, 2).join(' ')}
      </text>
      <text x={C} y={C + 15} textAnchor="middle" className="fill-[var(--text)] font-display text-[15px] font-bold">
        {center.split(' ').slice(2).join(' ')}
      </text>
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="30" fill={i === steps.length - 1 ? 'var(--c-forest)' : 'var(--surface)'} stroke="var(--border)" />
          <text x={p.x} y={p.y + 4} textAnchor="middle"
            className={i === steps.length - 1 ? 'fill-[var(--c-snow)] font-mono text-[9px] uppercase' : 'fill-[var(--text)] font-mono text-[10px] uppercase'}>
            {steps[i].length > 10 ? steps[i].split(' ').slice(-1)[0] : steps[i]}
          </text>
        </g>
      ))}
    </svg>
  );
}
