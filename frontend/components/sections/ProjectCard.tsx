import Link from 'next/link';
import type { Project } from '@/types';
import { ProjectVisual } from '@/components/three/Fallbacks';
import { cn } from '@/lib/utils';

export function ProjectCard({ project, className, priority }: { project: Project; className?: string; priority?: boolean }) {
  return (
    <Link href={`/portfolio/${project.slug}`} className={cn('group block rounded-xl border border-line bg-surface p-3 transition-colors hover:border-gold/60', className)} data-priority={priority}>
      <ProjectVisual name={project.name} accent={project.accent} className="aspect-[16/10] w-full transition-transform duration-500 group-hover:scale-[1.015]" />
      <div className="flex items-start justify-between gap-4 px-2 pb-2 pt-4">
        <div>
          <h3 className="font-display text-xl font-semibold text-bone">{project.name}</h3>
          <p className="mt-1 max-w-[46ch] text-[0.95rem] text-muted">{project.summary}</p>
        </div>
        <span className="mt-1 shrink-0 rounded-full border border-gold/30 px-3 py-1 text-sm text-gold-soft">{project.industry}</span>
      </div>
    </Link>
  );
}
