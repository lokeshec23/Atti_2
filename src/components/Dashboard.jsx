import React, { useMemo } from 'react';
import {
  CheckCircle, Clock, Users, TrendingUp,
  AlertCircle, Layers, ArrowRight, Calendar
} from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

/* ─── helpers ─────────────────────────────────────────────── */
const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

function StatCard({ label, value, icon, color, subtext }) {
  return (
    <article
      className="stat-card"
      style={{
        background: 'var(--surface-color)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        boxShadow: 'var(--shadow-sm)',
        transition: 'var(--transition)',
      }}
      aria-label={`${label}: ${value}`}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: color + '1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          {icon}
        </div>
        <span
          style={{
            fontSize: '2rem',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: 'var(--text-color)',
            lineHeight: 1,
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
}

function ProgressBar({ label, count, total, color }) {
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
          height: '8px',
          background: 'var(--bg-color)',
          borderRadius: '100px',
          overflow: 'hidden',
          border: '1px solid var(--border-color)',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: color,
            borderRadius: '100px',
            transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>
    </div>
  );
}

function PriorityBadge({ priority }) {
  const colors = {
    high:   { bg: 'rgba(239,68,68,0.12)',   text: 'var(--danger)' },
    medium: { bg: 'rgba(245,158,11,0.12)',  text: 'var(--warning)' },
    low:    { bg: 'rgba(16,185,129,0.12)',  text: 'var(--success)' },
  };
  const c = colors[priority] || colors.low;
  return (
    <span style={{
      padding: '0.15rem 0.5rem',
      borderRadius: '4px',
      fontSize: '0.68rem',
      fontWeight: 700,
      textTransform: 'uppercase',
      background: c.bg,
      color: c.text,
    }}>
      {priority}
    </span>
  );
}

const STATUS_LABELS = { todo: 'To Do', 'in-progress': 'In Progress', done: 'Done' };

/* ─── Dashboard ───────────────────────────────────────────── */
export default function Dashboard() {
  const [tasks]   = useLocalStorage('tasks', []);
  const [members] = useLocalStorage('team_members', []);

  /* ── computed stats ── */
  const stats = useMemo(() => {
    const total      = tasks.length;
    const done       = tasks.filter(t => t.status === 'done').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const todo       = tasks.filter(t => t.status === 'todo').length;
    const completion = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, inProgress, todo, completion };
  }, [tasks]);

  /* ── recent activity: 5 most recent tasks sorted by id (Date.now-based) ── */
  const recentTasks = useMemo(() => {
    return [...tasks]
      .sort((a, b) => Number(b.id) - Number(a.id))
      .slice(0, 5);
  }, [tasks]);

  /* ── priority breakdown ── */
  const priorityBreakdown = useMemo(() => {
    const high   = tasks.filter(t => t.priority === 'high').length;
    const medium = tasks.filter(t => t.priority === 'medium').length;
    const low    = tasks.filter(t => t.priority === 'low').length;
    return { high, medium, low };
  }, [tasks]);

  return (
    <div style={{ padding: '2rem', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Page Heading */}
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          color: 'var(--text-color)',
          marginBottom: '0.35rem',
        }}>
          Dashboard
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Live overview of your team's work
        </p>
      </header>

      {/* ── Stat Cards ── */}
      <section aria-label="Key metrics">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}>
          <StatCard
            label="Total Tasks"
            value={stats.total}
            icon={<Layers size={22} color="var(--accent-color)" />}
            color="var(--accent-color)"
            subtext={`${stats.todo} pending`}
          />
          <StatCard
            label="In Progress"
            value={stats.inProgress}
            icon={<Clock size={22} color="var(--warning)" />}
            color="var(--warning)"
            subtext="Currently active"
          />
          <StatCard
            label="Team Members"
            value={members.length}
            icon={<Users size={22} color="var(--info)" />}
            color="var(--info)"
            subtext={members.length === 1 ? '1 contributor' : `${members.length} contributors`}
          />
          <StatCard
            label="Completion Rate"
            value={`${stats.completion}%`}
            icon={<TrendingUp size={22} color="var(--success)" />}
            color="var(--success)"
            subtext={`${stats.done} of ${stats.total} done`}
          />
        </div>
      </section>

      {/* ── Bottom Grid: Task Breakdown + Activity Feed ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.25rem',
      }}>

        {/* Task Breakdown */}
        <section
          aria-labelledby="breakdown-heading"
          style={{
            background: 'var(--surface-color)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
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
                { label: 'High',   count: priorityBreakdown.high,   color: 'var(--danger)' },
                { label: 'Medium', count: priorityBreakdown.medium, color: 'var(--warning)' },
                { label: 'Low',    count: priorityBreakdown.low,    color: 'var(--success)' },
              ].map(({ label, count, color }) => (
                <div key={label} style={{
                  flex: '1 1 80px',
                  background: 'var(--bg-color)',
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  textAlign: 'center',
                  border: '1px solid var(--border-color)',
                }}>
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
            background: 'var(--surface-color)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <h2 id="activity-heading" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-color)' }}>
            Recent Tasks
          </h2>

          {recentTasks.length === 0 ? (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              color: 'var(--text-secondary)',
              gap: '0.75rem',
            }}>
              <AlertCircle size={36} strokeWidth={1.5} />
              <p style={{ fontSize: '0.9rem' }}>No tasks yet — add one from the Tasks board!</p>
            </div>
          ) : (
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {recentTasks.map(task => (
                <li
                  key={task.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    padding: '0.85rem 1rem',
                    background: 'var(--bg-color)',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    transition: 'var(--transition)',
                  }}
                >
                  {/* Status dot */}
                  <span
                    aria-hidden="true"
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      flexShrink: 0,
                      background:
                        task.status === 'done'        ? 'var(--success)'
                        : task.status === 'in-progress' ? 'var(--warning)'
                        : 'var(--accent-color)',
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: 'var(--text-color)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {task.title}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
                      {STATUS_LABELS[task.status] || task.status}
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
