import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/event-ingestion', label: 'Event Ingestion' },
  { path: '/customer-state', label: 'Customer State' },
  { path: '/audit-logs', label: 'Audit Logs' },
  { path: '/replay-simulator', label: 'Replay Simulator' }
];

export default function Sidebar() {
  return (
    <aside className="border-b border-white/10 bg-slate-950/70 px-4 py-6 backdrop-blur xl:min-h-screen xl:w-72 xl:border-b-0 xl:border-r xl:px-6">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.35em] text-brand-300/90">EMI Platform</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Event Reconstruction</h1>
        <p className="mt-2 text-sm text-slate-300">
          Event sourcing workspace for ingestion, replay, and audit visibility.
        </p>
      </div>

      <nav className="grid gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              [
                'rounded-2xl border px-4 py-3 text-sm font-medium transition',
                isActive
                  ? 'border-brand-500/40 bg-brand-500/15 text-white shadow-glow'
                  : 'border-white/5 bg-white/5 text-slate-300 hover:border-brand-400/30 hover:bg-white/8 hover:text-white'
              ].join(' ')
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
