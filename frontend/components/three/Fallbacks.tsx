import type { SceneKind } from '@/types';
import { cn } from '@/lib/utils';

/** Line-art glyph per service. Used as list icons and as the static fallback for 3D scenes. */
export function ServiceGlyph({ kind, className }: { kind: SceneKind; className?: string }) {
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
  return (
    <svg viewBox="0 0 96 96" className={cn('text-gold', className)} aria-hidden>
      {kind === 'web' && <g {...p}><rect x="10" y="18" width="76" height="60" rx="6" /><path d="M10 32h76" /><circle cx="19" cy="25" r="1.5" /><circle cx="26" cy="25" r="1.5" /><rect x="20" y="42" width="30" height="20" rx="2" /><path d="M58 44h18M58 54h18M20 70h56" /></g>}
      {kind === 'app' && <g {...p}><rect x="30" y="8" width="36" height="80" rx="8" /><path d="M42 16h12" /><rect x="37" y="28" width="22" height="14" rx="2" /><path d="M37 50h22M37 58h14" /><circle cx="48" cy="76" r="3" /></g>}
      {kind === 'marketing' && <g {...p}><path d="M14 82V56M34 82V44M54 82V62M74 82V26" strokeWidth="6" /><path d="M12 48 34 30l20 14 30-26" /><path d="M72 16h12v12" /></g>}
      {kind === 'arvr' && <g {...p}><rect x="8" y="30" width="80" height="36" rx="14" /><circle cx="32" cy="48" r="9" /><circle cx="64" cy="48" r="9" /><path d="M8 48H4M92 48h-4M44 48h8" /></g>}
      {kind === 'model' && <g {...p}><path d="M48 10 82 28v40L48 86 14 68V28z" /><path d="M14 28l34 18 34-18M48 46v40" /></g>}
      {kind === 'uiux' && <g {...p}><rect x="12" y="14" width="46" height="34" rx="5" /><rect x="38" y="40" width="46" height="34" rx="5" /><path d="M20 24h20M20 32h12" /><path d="m60 62 8 20 4-8 8-4z" fill="currentColor" /></g>}
    </svg>
  );
}

/** Static hero poster: identical composition to the 3D scene, zero JavaScript required. */
export function HeroPoster({ className }: { className?: string }) {
  const nodes = [[50, 12], [78, 24], [88, 52], [74, 80], [46, 90], [20, 74], [10, 46], [24, 20], [36, 42], [64, 40], [58, 66], [34, 62]];
  const links = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0], [8, 9], [9, 10], [10, 11], [11, 8], [0, 8], [1, 9], [2, 9], [3, 10], [5, 11], [6, 11], [7, 8]];
  return (
    <div className={cn('absolute inset-0 grid place-items-center', className)} aria-hidden>
      <div className="absolute h-[70%] w-[70%] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.22)_0%,transparent_65%)]" />
      <svg viewBox="0 0 100 100" className="relative h-[80%] w-[80%] max-w-[34rem]">
        {links.map(([a, b], i) => <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke="#D4AF37" strokeOpacity=".4" strokeWidth=".3" />)}
        {nodes.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i % 4 === 0 ? 1.4 : 0.9} fill={i % 4 === 0 ? '#fff' : '#D4AF37'} />)}
        <polygon points="50,38 62,45 62,58 50,66 38,58 38,45" fill="#D4AF37" fillOpacity=".9" />
        <polygon points="50,38 62,45 50,52 38,45" fill="#F1D97A" />
      </svg>
    </div>
  );
}

export function ServicePoster({ kind, className }: { kind: SceneKind; className?: string }) {
  return (
    <div className={cn('absolute inset-0 grid place-items-center', className)} aria-hidden>
      <div className="absolute h-2/3 w-2/3 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.18)_0%,transparent_65%)]" />
      <ServiceGlyph kind={kind} className="relative h-1/2 w-1/2 max-h-56 max-w-56" />
    </div>
  );
}

/** Abstract UI composition tinted with the project accent: the 2D visual for case studies. */
export function ProjectVisual({ name, accent, className }: { name: string; accent: string; className?: string }) {
  return (
    <div className={cn('relative overflow-hidden rounded-lg border border-white/10 bg-[#0b0b0b]', className)} role="img" aria-label={`${name} interface preview`}>
      <div className="flex h-[9%] items-center gap-1.5 bg-[#1b1b1b] px-[4%]"><span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} /><span className="h-1.5 w-1.5 rounded-full bg-white/20" /><span className="h-1.5 w-1.5 rounded-full bg-white/20" /></div>
      <div className="mx-[6%] mt-[5%] h-[38%] rounded-md p-[5%]" style={{ background: `linear-gradient(120deg, ${accent}, #141414)` }}>
        <p className="font-display text-[clamp(0.9rem,2.4vw,1.5rem)] font-bold text-black">{name}</p>
        <div className="mt-2 h-1 w-1/3 rounded bg-black/50" /><div className="mt-1.5 h-1 w-1/4 rounded bg-black/40" />
      </div>
      <div className="mx-[6%] mt-[5%] grid grid-cols-3 gap-[3%]">
        {[0, 1, 2].map((i) => <div key={i} className="h-[4.5rem] rounded bg-[#1e1e1e] p-2 sm:h-20"><div className="h-1 w-6 rounded" style={{ background: accent }} /><div className="mt-2 h-1 w-full rounded bg-white/10" /><div className="mt-1 h-1 w-2/3 rounded bg-white/10" /></div>)}
      </div>
    </div>
  );
}
