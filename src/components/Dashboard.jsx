import React, { useMemo, memo } from 'react';
import {
  CheckCircle, Clock, Users, TrendingUp,
  AlertCircle, Layers, ArrowRight,
} from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS, TASK_STATUS, PRIORITY, TASK_STATUS_LABELS } from '../utils/constants';

/* ─── Sub-components — memoized for performance ───────────── */

const StatCard = memo(function StatCard({ label, value, icon, color, subtext }) {
  return (
    <article
      className="stat-card"
      aria-label={`${label}: ${value}`}
      style={{
        background: 'var(--surface-color)', border: '1px solid var(--border-color)',
        borderRadius: '16px', padding: '1.5rem',
        display: 'flex', flexDirection: 'column', gap: '1rem',
        boxShadow: 'var(--shadow-sm)', transition: 'var(--transition)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div
          aria-hidden="true"
          style={{
            width: '48px', height: '48px', borderRadius: '14px',
            background: color + '1a',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <span
          style={{
            fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.04em',
            color: 'var(--text-color)', lineHeight: 1,
          }}
        >
          {value}
        </span>
      </div>
      <div>
        <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-color)' }}>{label}</p>
        {subtext && (
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            {subtext}
          </p>
        )}
      </div>
    </article>
  );
});

const ProgressBar = memo(function ProgressBar({ label, count, total, color }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
        <span style={{ fontWeight: 500, color: 'var(--text-color)' }}>{label}</span>
        <span style={{ color: 'var(--text-secondary)' }}>
          {count} <span style={{ fontSize: '0.75rem' }}>({pct}%)</span>
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${pct}%`}
        style={{
          height: '8px', background: 'var(--bg-color)',
          borderRadius: '100px', overflow: 'hidden', border: '1px solid var(--border-color)',
        }}
      >
        <div
          style={{
            height: '100%', width: `${pct}%`, background: color,
            borderRadius: '100px', transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>
    </div>
  );
});

const PriorityBadge = memo(function PriorityBadge({ priority }) {
  const colors = {
    [PRIORITY.HIGH]:   { bg: 'rgba(239,68,68,0.12)',  text: 'var(--danger)' },
    [PRIORITY.MEDIUM]: { bg: 'rgba(245,158,11,0.12)', text: 'var(--warning)' },
    [PRIORITY.LOW]:    { bg: 'rgba(16,185,129,0.12)', text: 'var(--success)' },
  };
  const c = colors[priority] ?? colors[PRIORITY.LOW];
  return (
    <span
      aria-label={`Priority: ${priority}`}
      style={{
        padding: '0.15rem 0.5rem', borderRadius: '4px',
        fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase',
        background: c.bg, color: c.text,
      }}
    >
      {priority}
    </span>
  );
});

/* ─── Status dot with accessible text ────────────────────── */
const STATUS_DOT_COLORS = {
  [TASK_STATUS.DONE]:        'var(--success)',
  [TASK_STATUS.IN_PROGRESS]: 'var(--warning)',
  [TASK_STATUS.TODO]:        'var(--accent-color)',
};

/* ─── Dashboard ───────────────────────────────────────────── */
export default function Dashboard() {
  const [tasks]   = useLocalStorage(STORAGE_KEYS.TASKS, []);
  const [members] = useLocalStorage(STORAGE_KEYS.TEAM_MEMBERS, []);

  /* ── Single-pass computed stats ── */
  const stats = useMemo(() => {
    let done = 0, inProgress = 0, todo = 0;
    let high = 0, medium = 0, low = 0;

    for (const t of tasks) {
      if (t.status === TASK_STATUS.DONE)        done++;
      else if (t.status === TASK_STATUS.IN_PROGRESS) inProgress++;
      else                                       todo++;

      if (t.priority === PRIORITY.HIGH)         high++;
      else if (t.priority === PRIORITY.MEDIUM)  medium++;
      else                                      low++;
    }

    const total      = tasks.length;
    const completion = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, inProgress, todo, completion, high, medium, low };
  }, [tasks]);

  /* ── 5 most recently added tasks ── */
  const recentTasks = useMemo(() => {
    return [...tasks]
      .sort((a, b) => Number(b.id) - Number(a.id))
      .slice(0, 5);
  }, [tasks]);

  return (
    <div style={{ padding: '2rem', maxWidth: '1280px', margin: '0 auto' }}>

      {/* Page Heading */}
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-color)', marginBottom: '0.35rem' }}>
          Dashboard
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Live overview of your team&apos;s work
        </p>
      </header>

      {/* ── Stat Cards ── */}
      <section aria-label="Key metrics">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          <StatCard
            label="Total Tasks"
            value={stats.total}
            icon={<Layers size={22} color="var(--accent-color)" aria-hidden="true" />}
            color="var(--accent-color)"
            subtext={`${stats.todo} pending`}
          />
          <StatCard
            label="In Progress"
            value={stats.inProgress}
            icon={<Clock size={22} color="var(--warning)" aria-hidden="true" />}
            color="var(--warning)"
            subtext="Currently active"
          />
          <StatCard
            label="Team Members"
            value={members.length}
            icon={<Users size={22} color="var(--info)" aria-hidden="true" />}
            color="var(--info)"
            subtext={members.length === 1 ? '1 contributor' : `${members.length} contributors`}
          />
          <StatCard
            label="Completion Rate"
            value={`${stats.completion}%`}
            icon={<TrendingUp size={22} color="var(--success)" aria-hidden="true" />}
            color="var(--success)"
            subtext={`${stats.done} of ${stats.total} done`}
          />
        </div>
      </section>

      {/* ── Bottom Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>

        {/* Task Breakdown */}
        <section
          aria-labelledby="breakdown-heading"
          style={{
            background: 'var(--surface-color)', border: '1px solid var(--border-color)',
            borderRadius: '16px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)',
            display: 'flex', flexDirection: 'column', gap: '1.5rem',
          }}
        >
          <h2 id="breakdown-heading" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-color)' }}>
            Task Status
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <ProgressBar label="To Do"       count={stats.todo}       total={stats.total} color="var(--accent-color)" />
            <ProgressBar label="In Progress" count={stats.inProgress} total={stats.total} color="var(--warning)" />
            <ProgressBar label="Done"        count={stats.done}       total={stats.total} color="var(--success)" />
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              By Priority
            </h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {[
                { label: 'High',   count: stats.high,   color: 'var(--danger)' },
                { label: 'Medium', count: stats.medium, color: 'var(--warning)' },
                { label: 'Low',    count: stats.low,    color: 'var(--success)' },
              ].map(({ label, count, color }) => (
                <div
                  key={label}
                  aria-label={`${label} priority: ${count} task${count !== 1 ? 's' : ''}`}
                  style={{
                    flex: '1 1 80px', background: 'var(--bg-color)',
                    borderRadius: '10px', padding: '0.75rem 1rem',
                    textAlign: 'center', border: '1px solid var(--border-color)',
                  }}
                >
                  <p style={{ fontSize: '1.5rem', fontWeight: 800, color, lineHeight: 1 }}>{count}</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Activity Feed */}
        <section
          aria-labelledby="activity-heading"
          aria-live="polite"
          style={{
            background: 'var(--surface-color)', border: '1px solid var(--border-color)',
            borderRadius: '16px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)',
            display: 'flex', flexDirection: 'column', gap: '1rem',
          }}
        >
          <h2 id="activity-heading" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-color)' }}>
            Recent Tasks
          </h2>

          {recentTasks.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', color: 'var(--text-secondary)', gap: '0.75rem' }}>
              <AlertCircle size={36} strokeWidth={1.5} aria-hidden="true" />
              <p style={{ fontSize: '0.9rem' }}>No tasks yet — add one from the Tasks board!</p>
            </div>
          ) : (
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {recentTasks.map(task => (
                <li
                  key={task.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.85rem',
                    padding: '0.85rem 1rem', background: 'var(--bg-color)',
                    borderRadius: '10px', border: '1px solid var(--border-color)',
                    transition: 'var(--transition)',
                  }}
                >
                  {/* Status indicator — color + text for accessibility */}
                  <span
                    aria-label={TASK_STATUS_LABELS[task.status] ?? task.status}
                    title={TASK_STATUS_LABELS[task.status] ?? task.status}
                    style={{
                      width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                      background: STATUS_DOT_COLORS[task.status] ?? 'var(--text-secondary)',
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-color)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {task.title}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
                      {TASK_STATUS_LABELS[task.status] ?? task.status}
                    </p>
                  </div>
                  <PriorityBadge priority={task.priority} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
