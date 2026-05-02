import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Dashboard from '../components/Dashboard';

// Polyfill localStorage in jsdom
beforeEach(() => {
  localStorage.clear();
});

describe('Dashboard', () => {
  it('renders heading and "Total Tasks" stat card', () => {
    render(<Dashboard />);
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/total tasks/i)).toBeInTheDocument();
  });

  it('shows 0 for all stats when no tasks are stored', () => {
    render(<Dashboard />);
    // All numeric stat values should be 0 or 0%
    expect(screen.getByLabelText(/total tasks: 0/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/in progress: 0/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/completion rate: 0%/i)).toBeInTheDocument();
  });

  it('shows "No tasks yet" message when task list is empty', () => {
    render(<Dashboard />);
    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
  });

  it('reflects tasks loaded from localStorage', () => {
    const tasks = [
      { id: '1', title: 'Task A', status: 'done', priority: 'high' },
      { id: '2', title: 'Task B', status: 'in-progress', priority: 'medium' },
      { id: '3', title: 'Task C', status: 'todo', priority: 'low' },
    ];
    localStorage.setItem('tasks', JSON.stringify(tasks));

    render(<Dashboard />);

    // Total = 3
    expect(screen.getByLabelText(/total tasks: 3/i)).toBeInTheDocument();
    // In Progress = 1
    expect(screen.getByLabelText(/in progress: 1/i)).toBeInTheDocument();
    // Completion = 33% (1/3)
    expect(screen.getByLabelText(/completion rate: 33%/i)).toBeInTheDocument();
  });

  it('lists recent tasks in the activity feed', () => {
    const tasks = [
      { id: '100', title: 'My Test Task', status: 'todo', priority: 'high' },
    ];
    localStorage.setItem('tasks', JSON.stringify(tasks));

    render(<Dashboard />);
    expect(screen.getByText('My Test Task')).toBeInTheDocument();
  });

  it('renders member count from localStorage', () => {
    const members = [
      { id: 1, name: 'Alice', role: 'Dev', email: 'a@a.com', location: 'NY' },
      { id: 2, name: 'Bob',   role: 'PM',  email: 'b@b.com', location: 'LA' },
    ];
    localStorage.setItem('team_members', JSON.stringify(members));
    render(<Dashboard />);
    expect(screen.getByLabelText(/team members: 2/i)).toBeInTheDocument();
  });
});
