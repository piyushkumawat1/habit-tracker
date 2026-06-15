export function Card({ children, className = '' }) {
  return (
    <div className={`rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm ${className}`} style={{ borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', boxShadow: 'var(--shadow-sm)' }}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`} style={{ display: 'flex', flexDirection: 'column', padding: '24px' }}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`font-semibold leading-none tracking-tight ${className}`} style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-sm text-muted-foreground ${className}`} style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`p-6 pt-0 ${className}`} style={{ padding: '0 24px 24px 24px' }}>
      {children}
    </div>
  );
}
