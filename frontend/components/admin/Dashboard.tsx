'use client';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiError, admin, type ListResult, type Row, type Stats } from '@/lib/api';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { FormAlert } from '@/components/ui/StatusMessage';
import { clearToken, getToken } from './session';
import { cn, formatDate } from '@/lib/utils';

const STATUSES = ['new', 'contacted', 'qualified', 'closed'];
const TITLES: Record<string, string> = { enquiries: 'Enquiries', consultations: 'Consultation requests', 'health-checkups': 'Health Checkup leads', 'lead-magnet': 'Lead Magnet leads', applications: 'Job applications' };
const statusColor: Record<string, string> = { new: 'text-gold border-gold/50', contacted: 'text-sky-300 border-sky-300/40', qualified: 'text-ok border-ok/40', closed: 'text-dim border-line' };

export function Dashboard() {
  const router = useRouter();
  const [token, setTokenState] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [tab, setTab] = useState('enquiries');
  const [data, setData] = useState<ListResult | null>(null);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);
  const [detail, setDetail] = useState<Record<string, unknown> | null>(null);

  const guard = useCallback((e: unknown) => {
    if (e instanceof ApiError && e.status === 401) { clearToken(); router.replace('/admin/login'); return; }
    setError(e instanceof ApiError ? e.message : 'Something went wrong.');
  }, [router]);

  useEffect(() => { const t = getToken(); if (!t) router.replace('/admin/login'); else setTokenState(t); }, [router]);

  const loadStats = useCallback(async (t: string) => { try { setStats(await admin.stats(t)); } catch (e) { guard(e); } }, [guard]);
  useEffect(() => { if (token) void loadStats(token); }, [token, loadStats]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setLoading(true); setError('');
    const id = setTimeout(async () => {
      try { const r = await admin.list(token, tab, { page, limit: 15, q, status }); if (!cancelled) setData(r); }
      catch (e) { if (!cancelled) guard(e); }
      finally { if (!cancelled) setLoading(false); }
    }, q ? 250 : 0);
    return () => { cancelled = true; clearTimeout(id); };
  }, [token, tab, page, q, status, guard]);

  async function changeStatus(row: Row, next: string) {
    if (!token) return;
    try {
      const updated = await admin.setStatus(token, tab, row.id, next);
      setData((d) => d && { ...d, items: d.items.map((r) => (r.id === row.id ? updated : r)) });
      void loadStats(token);
    } catch (e) { guard(e); }
  }

  async function toggle(row: Row) {
    if (open === row.id) { setOpen(null); return; }
    setOpen(row.id); setDetail(null);
    try { setDetail(await admin.detail(token as string, tab, row.id)); } catch (e) { guard(e); }
  }

  async function downloadResume(id: string) {
    try {
      const { blob, filename } = await admin.resume(token as string, id);
      const url = URL.createObjectURL(blob);
      const a = Object.assign(document.createElement('a'), { href: url, download: filename });
      a.click(); URL.revokeObjectURL(url);
    } catch (e) { guard(e); }
  }

  if (!token) return null;
  const selectTab = (k: string) => { setTab(k); setPage(1); setOpen(null); setStatus(''); setQ(''); };

  return (
    <Container className="pb-24">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-display-md">Dashboard</h1>
        <Button variant="secondary" onClick={() => { clearToken(); router.replace('/admin/login'); }}>Sign out</Button>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-5" role="tablist" aria-label="Lead types">
        {(stats?.collections ?? Object.keys(TITLES).map((key) => ({ key, label: TITLES[key], total: 0, new: 0, last7Days: 0 }))).map((c) => (
          <button key={c.key} role="tab" aria-selected={tab === c.key} onClick={() => selectTab(c.key)}
            className={cn('rounded-xl border p-4 text-left transition-colors', tab === c.key ? 'border-gold bg-gold/10' : 'border-line bg-surface hover:border-gold/50')}>
            <span className="block text-sm text-muted">{c.label}</span>
            <span className="mt-1 block font-display text-3xl font-bold">{stats ? c.total : '-'}</span>
            <span className="text-sm text-dim">{stats ? `${c.new} new, ${c.last7Days} this week` : ' '}</span>
          </button>
        ))}
      </div>
      {stats && <p className="mt-3 text-sm text-dim">{stats.grandTotal} submissions in total</p>}

      <div className="mt-10 flex flex-wrap items-end gap-3">
        <h2 className="mr-auto font-display text-xl font-semibold">{TITLES[tab]}</h2>
        <label className="text-sm text-muted">Search<input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Name, email, company" className="ml-2 h-10 rounded-full border border-line bg-surface px-4 text-bone focus:border-gold focus:outline-none" /></label>
        <label className="text-sm text-muted">Status
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="ml-2 h-10 rounded-full border border-line bg-surface px-4 text-bone focus:border-gold focus:outline-none">
            <option value="">All</option>{STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
      </div>

      {error && <div className="mt-4"><FormAlert kind="error">{error}</FormAlert></div>}

      <div className="mt-4 overflow-x-auto rounded-xl border border-line" data-lenis-prevent>
        <table className="w-full min-w-[56rem] text-left text-[0.95rem]">
          <thead className="bg-surface text-sm text-dim">
            <tr>{['Name', 'Email', 'Phone', 'Company', 'Requirement', 'Date', 'Status'].map((h) => <th key={h} scope="col" className="px-4 py-3 font-medium">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-line">
            {loading && !data && <tr><td colSpan={7} className="px-4 py-10 text-center text-muted">Loading...</td></tr>}
            {data && data.items.length === 0 && <tr><td colSpan={7} className="px-4 py-10 text-center text-muted">Nothing here yet. New submissions will appear as they arrive.</td></tr>}
            {data?.items.map((r) => (
              <Fragment key={r.id}>
                <tr className={cn('hover:bg-white/[0.03]', loading && 'opacity-60')}>
                  <td className="px-4 py-3"><button className="text-left font-medium text-bone hover:text-gold" aria-expanded={open === r.id} onClick={() => toggle(r)}>{r.name}</button></td>
                  <td className="px-4 py-3 text-muted">{r.email}</td>
                  <td className="px-4 py-3 text-muted">{r.phone}</td>
                  <td className="px-4 py-3 text-muted">{r.company || '-'}</td>
                  <td className="max-w-[16rem] truncate px-4 py-3 text-muted" title={r.requirement}>{r.requirement}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDate(r.createdAt)}</td>
                  <td className="px-4 py-3">
                    <select aria-label={`Status for ${r.name}`} value={r.status} onChange={(e) => changeStatus(r, e.target.value)} className={cn('rounded-full border bg-black px-3 py-1 text-sm', statusColor[r.status])}>
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
                {open === r.id && (
                  <tr className="bg-surface/60">
                    <td colSpan={7} className="px-4 py-5">
                      {!detail ? <p className="text-muted">Loading details...</p> : (
                        <div className="space-y-3">
                          <dl className="grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
                            {Object.entries(detail).filter(([k]) => !['_id', 'name', 'email', 'phone', 'company', 'createdAt', 'updatedAt', 'status', 'resume'].includes(k)).map(([k, v]) => (
                              <div key={k}><dt className="text-dim">{k}</dt><dd className="whitespace-pre-wrap break-words text-bone/90">{typeof v === 'object' ? JSON.stringify(v, null, 1) : String(v)}</dd></div>
                            ))}
                          </dl>
                          {tab === 'applications' && <Button variant="secondary" onClick={() => downloadResume(r.id)}>Download resume</Button>}
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {data && data.pages > 1 && (
        <div className="mt-6 flex items-center justify-between text-sm text-muted">
          <span>Page {data.page} of {data.pages} ({data.total} records)</span>
          <div className="flex gap-2"><Button variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button><Button variant="secondary" disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)}>Next</Button></div>
        </div>
      )}
    </Container>
  );
}
