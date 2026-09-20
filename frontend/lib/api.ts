const BASE = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(public status: number, message: string, public code = 'ERROR', public fields: Record<string, string> = {}) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit = {}, token?: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      ...init,
      headers: { ...(init.body && !(init.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init.headers },
    });
  } catch {
    throw new ApiError(0, 'We could not reach the server. Check your connection and try again.', 'NETWORK');
  }
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) {
    throw new ApiError(res.status, json?.error?.message ?? 'Something went wrong. Please try again.', json?.error?.code, json?.error?.fields);
  }
  return json.data as T;
}

const page = () => (typeof window === 'undefined' ? undefined : window.location.pathname);
const post = <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify({ ...(body as object), sourcePage: page() }) });

export const api = {
  contact: (d: unknown) => post<{ id: string }>('/api/contact', d),
  consultation: (d: unknown) => post<{ id: string }>('/api/consultation', d),
  healthCheckup: (d: unknown) => post<{ id: string; score: number; level: string; insights: string[] }>('/api/health-checkup', d),
  leadMagnet: (d: unknown) => post<{ id: string; downloadUrl: string }>('/api/lead-magnet', d),
  application: (fd: FormData) => request<{ id: string }>('/api/applications', { method: 'POST', body: fd }),
};

/* ---------- Admin ---------- */
export interface Row { id: string; name: string; email: string; phone: string; company: string; requirement: string; status: string; createdAt: string }
export interface Stats { collections: { key: string; label: string; total: number; new: number; last7Days: number }[]; grandTotal: number }
export interface ListResult { items: Row[]; total: number; page: number; pages: number }

export const admin = {
  login: (email: string, password: string) => request<{ token: string }>('/api/admin/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  stats: (t: string) => request<Stats>('/api/admin/stats', {}, t),
  list: (t: string, key: string, params: Record<string, string | number | undefined>) => {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined && v !== '').map(([k, v]) => [k, String(v)]));
    return request<ListResult>(`/api/admin/${key}?${qs}`, {}, t);
  },
  detail: (t: string, key: string, id: string) => request<Record<string, unknown>>(`/api/admin/${key}/${id}`, {}, t),
  setStatus: (t: string, key: string, id: string, status: string) => request<Row>(`/api/admin/${key}/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }, t),
  async resume(t: string, id: string) {
    const res = await fetch(`${BASE}/api/admin/applications/${id}/resume`, { headers: { Authorization: `Bearer ${t}` } });
    if (!res.ok) throw new ApiError(res.status, 'Could not download the resume.');
    const cd = res.headers.get('Content-Disposition') ?? '';
    return { blob: await res.blob(), filename: /filename="([^"]+)"/.exec(cd)?.[1] ?? 'resume' };
  },
};
