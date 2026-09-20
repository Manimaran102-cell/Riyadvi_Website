const KEY = 'riyadvi_admin_token';
// sessionStorage: cleared when the tab closes. Tokens expire after 8 hours server-side.
export const getToken = () => (typeof window === 'undefined' ? null : window.sessionStorage.getItem(KEY));
export const setToken = (t: string) => window.sessionStorage.setItem(KEY, t);
export const clearToken = () => window.sessionStorage.removeItem(KEY);
