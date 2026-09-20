/** Re-mounts on every navigation, giving each route a short entrance transition. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="route-in">{children}</div>;
}
