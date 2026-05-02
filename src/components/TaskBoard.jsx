import React, { useState, useCallback, useMemo, useRef } from 'react';
import { MoreHorizontal, Plus, Edit2, Trash2, Search, ChevronDown } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import Modal from './Modal';
import TaskForm from './TaskForm';
import {
  STORAGE_KEYS,
  BOARD_COLUMNS,
  TASK_STATUS,
  PRIORITY,
} from '../utils/constants';

/** Initial seed tasks — only used when localStorage is empty */
const INITIAL_TASKS = [
  { id: '1', title: 'Setup Frontend',        desc: 'Initialize Vite and React',           status: TASK_STATUS.TODO,        priority: PRIORITY.HIGH },
  { id: '2', title: 'Design Database Schema', desc: 'Define local storage structure',      status: TASK_STATUS.TODO,        priority: PRIORITY.MEDIUM },
  { id: '3', title: 'Create Login UI',        desc: 'Build minimal auth forms',            status: TASK_STATUS.IN_PROGRESS, priority: PRIORITY.HIGH },
  { id: '4', title: 'Configure Components',   desc: 'Setup basic layout components',       status: TASK_STATUS.DONE,        priority: PRIORITY.LOW },
];

/** Priority badge color map */
const PRIORITY_STYLES = {
  [PRIORITY.HIGH]:   { bg: 'rgba(239,68,68,0.1)',    text: 'var(--danger)' },
  [PRIORITY.MEDIUM]: { bg: 'rgba(245,158,11,0.1)',   text: 'var(--warning)' },
  [PRIORITY.LOW]:    { bg: 'rgba(16,185,129,0.1)',   text: 'var(--success)' },
};

/** Accessible confirmation — inline rather than window.confirm */
function DeleteConfirm({ taskTitle, onConfirm, onCancel }) {
  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-confirm-title"
      aria-describedby="delete-confirm-desc"
      style={{
        background: 'var(--surface-color)', border: '1px solid var(--border-color)',
        borderRadius: '12px', padding: '1.25rem', boxShadow: 'var(--shadow-lg)',
        maxWidth: '320px', margin: '0 auto',
      }}
    >
      <p id="delete-confirm-title" style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-color)' }}>
        Delete Task?
      </p>
      <p id="delete-confirm-desc" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        <strong>"{taskTitle}"</strong> will be permanently removed.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <button onClick={onCancel} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
          Cancel
        </button>
        <button onClick={onConfirm} className="btn btn-danger" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default function TaskBoard() {
  const [tasks, setTasks]         = useLocalStorage(STORAGE_KEYS.TASKS, INITIAL_TASKS);
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask]   = useState(null);
  const [defaultStatus, setDefaultStatus] = useState(TASK_STATUS.TODO);
  const [searchQuery, setSearchQuery]   = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null); // task object to confirm delete
  const addBtnRef = useRef(null);

  /** Memoized search filter */
  const filteredTasks = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return tasks;
    return tasks.filter(t =>
      t.title.toLowerCase().includes(q) ||
      (t.desc ?? '').toLowerCase().includes(q),
    );
  }, [tasks, searchQuery]);

  /** Pre-group tasks by status column — avoids repeated .filter() in render */
  const tasksByColumn = useMemo(() => {
    return Object.fromEntries(
      BOARD_COLUMNS.map(col => [
        col.id,
        filteredTasks.filter(t => t.status === col.id),
      ]),
    );
  }, [filteredTasks]);

  // ── Drag & Drop ───────────────────────────────────────────
  const handleDragStart = useCallback((e, id) => {
    setDraggedTaskId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  }, []);

  const handleDragOver = useCallback((e, colId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(colId);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverColumn(null);
  }, []);

  const handleDrop = useCallback((e, status) => {
    e.preventDefault();
    setDragOverColumn(null);
    if (draggedTaskId) {
      setTasks(prev =>
        prev.map(task => task.id === draggedTaskId ? { ...task, status } : task),
      );
      setDraggedTaskId(null);
    }
  }, [draggedTaskId, setTasks]);

  const handleDragEnd = useCallback(() => {
    setDraggedTaskId(null);
    setDragOverColumn(null);
  }, []);

  // ── Keyboard task movement ────────────────────────────────
  const handleMoveTask = useCallback((task, direction) => {
    const columnIds = BOARD_COLUMNS.map(c => c.id);
    const currentIdx = columnIds.indexOf(task.status);
    const nextIdx = currentIdx + direction;
    if (nextIdx < 0 || nextIdx >= columnIds.length) return;
    const nextStatus = columnIds[nextIdx];
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: nextStatus } : t));
  }, [setTasks]);

  // ── CRUD ─────────────────────────────────────────────────
  const handleAddTask = useCallback((status = TASK_STATUS.TODO) => {
    setEditingTask(null);
    setDefaultStatus(status);
    setIsModalOpen(true);
  }, []);

  const handleEditTask = useCallback((task) => {
    setEditingTask(task);
    setDefaultStatus(task.status);
    setIsModalOpen(true);
  }, []);

  const handleDeleteRequest = useCallback((task) => {
    setConfirmDelete(task);
    setIsModalOpen(true);
    setEditingTask(null);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (confirmDelete) {
      setTasks(prev => prev.filter(t => t.id !== confirmDelete.id));
    }
    setConfirmDelete(null);
    setIsModalOpen(false);
  }, [confirmDelete, setTasks]);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setEditingTask(null);
    setConfirmDelete(null);
  }, []);

  const handleFormSubmit = useCallback((data) => {
    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...data, id: t.id } : t));
    } else {
      setTasks(prev => [...prev, { ...data, status: defaultStatus, id: Date.now().toString() }]);
    }
    setIsModalOpen(false);
  }, [editingTask, defaultStatus, setTasks]);

  return (
    <div
      style={{
        padding: '2rem', height: '100%',
        display: 'flex', flexDirection: 'column', gap: '1.5rem',
      }}
    >
      {/* ── Board Header ─────────────────────────── */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-color)', marginBottom: '0.25rem' }}>
            Project Board
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Manage and track team tasks · {tasks.length} total
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search
              size={16} aria-hidden="true"
              style={{
                position: 'absolute', left: '0.75rem', top: '50%',
                transform: 'translateY(-50%)', color: 'var(--text-secondary)',
                pointerEvents: 'none',
              }}
            />
            <label htmlFor="task-search" className="sr-only">Search tasks</label>
            <input
              id="task-search"
              type="search"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Search tasks"
              style={{
                padding: '0.5rem 0.75rem 0.5rem 2.25rem',
                borderRadius: '20px', border: '1px solid var(--border-color)',
                background: 'var(--surface-color)', color: 'var(--text-color)',
                width: '220px', fontFamily: 'inherit', fontSize: '0.875rem',
              }}
            />
          </div>
          {/* New Task button */}
          <button
            ref={addBtnRef}
            className="btn btn-primary"
            onClick={() => handleAddTask()}
            aria-label="Create new task"
          >
            <Plus size={18} aria-hidden="true" /> New Task
          </button>
        </div>
      </header>

      {/* ── Kanban Columns ───────────────────────── */}
      <div
        role="region"
        aria-label="Task board"
        style={{ display: 'flex', gap: '1.25rem', overflowX: 'auto', flex: 1, paddingBottom: '1rem' }}
      >
        {BOARD_COLUMNS.map(col => (
          <section
            key={col.id}
            aria-labelledby={`col-${col.id}-heading`}
            onDragOver={e => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={e => handleDrop(e, col.id)}
            style={{
              background: dragOverColumn === col.id ? 'rgba(99,102,241,0.04)' : 'var(--surface-color)',
              minWidth: '300px', flex: 1, borderRadius: '12px',
              padding: '1.25rem', display: 'flex', flexDirection: 'column',
              border: dragOverColumn === col.id
                ? '2px solid var(--accent-color)'
                : '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)',
              transition: 'border-color 0.15s, background 0.15s',
            }}
          >
            {/* Column Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span
                  aria-hidden="true"
                  style={{ width: '8px', height: '8px', borderRadius: '50%', background: col.color, flexShrink: 0 }}
                />
                <h2 id={`col-${col.id}-heading`} style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-color)', margin: 0 }}>
                  {col.title}
                </h2>
                <span
                  aria-label={`${tasksByColumn[col.id]?.length ?? 0} tasks`}
                  style={{
                    background: 'var(--bg-color)', padding: '0.1rem 0.5rem',
                    borderRadius: '10px', fontSize: '0.75rem', color: 'var(--text-secondary)',
                    fontWeight: 600,
                  }}
                >
                  {tasksByColumn[col.id]?.length ?? 0}
                </span>
              </div>
              <button
                className="icon-btn"
                onClick={() => handleAddTask(col.id)}
                aria-label={`Add task to ${col.title}`}
              >
                <Plus size={16} aria-hidden="true" />
              </button>
            </div>

            {/* Task Cards */}
            <ul
              role="list"
              aria-label={`${col.title} tasks`}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1, overflowY: 'auto', minHeight: '80px', listStyle: 'none' }}
            >
              {tasksByColumn[col.id]?.map(task => {
                const pStyle = PRIORITY_STYLES[task.priority] ?? PRIORITY_STYLES[PRIORITY.LOW];
                const colIdx = BOARD_COLUMNS.findIndex(c => c.id === col.id);
                return (
                  <li
                    key={task.id}
                    draggable
                    onDragStart={e => handleDragStart(e, task.id)}
                    onDragEnd={handleDragEnd}
                    aria-label={`Task: ${task.title}, priority ${task.priority}`}
                    style={{
                      background: 'var(--bg-color)', padding: '1.25rem',
                      borderRadius: '10px', border: '1px solid var(--border-color)',
                      cursor: 'grab', boxShadow: 'var(--shadow-sm)',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      opacity: draggedTaskId === task.id ? 0.5 : 1,
                    }}
                    className="task-card"
                  >
                    {/* Title + actions */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-color)', lineHeight: 1.3 }}>
                        {task.title}
                      </h3>
                      <div style={{ display: 'flex', gap: '0.2rem', flexShrink: 0 }}>
                        <button
                          onClick={() => handleEditTask(task)}
                          className="icon-btn"
                          aria-label={`Edit task: ${task.title}`}
                          style={{ padding: '0.2rem', borderRadius: '6px' }}
                        >
                          <Edit2 size={13} aria-hidden="true" />
                        </button>
                        <button
                          onClick={() => handleDeleteRequest(task)}
                          className="icon-btn"
                          aria-label={`Delete task: ${task.title}`}
                          style={{ padding: '0.2rem', borderRadius: '6px', color: 'var(--danger)' }}
                        >
                          <Trash2 size={13} aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    {task.desc && (
                      <p style={{ margin: '0 0 0.85rem', color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.4 }}>
                        {task.desc}
                      </p>
                    )}

                    {/* Footer */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span
                        style={{
                          padding: '0.15rem 0.5rem', borderRadius: '4px',
                          fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 700,
                          background: pStyle.bg, color: pStyle.text,
                        }}
                        aria-label={`Priority: ${task.priority}`}
                      >
                        {task.priority}
                      </span>

                      {/* Keyboard move controls */}
                      <div style={{ display: 'flex', gap: '0.2rem' }}>
                        {colIdx > 0 && (
                          <button
                            onClick={() => handleMoveTask(task, -1)}
                            className="icon-btn"
                            aria-label={`Move "${task.title}" to ${BOARD_COLUMNS[colIdx - 1].title}`}
                            title={`Move to ${BOARD_COLUMNS[colIdx - 1].title}`}
                            style={{ padding: '0.15rem', fontSize: '0.65rem', borderRadius: '4px' }}
                          >
                            ←
                          </button>
                        )}
                        {colIdx < BOARD_COLUMNS.length - 1 && (
                          <button
                            onClick={() => handleMoveTask(task, 1)}
                            className="icon-btn"
                            aria-label={`Move "${task.title}" to ${BOARD_COLUMNS[colIdx + 1].title}`}
                            title={`Move to ${BOARD_COLUMNS[colIdx + 1].title}`}
                            style={{ padding: '0.15rem', fontSize: '0.65rem', borderRadius: '4px' }}
                          >
                            →
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}

              {tasksByColumn[col.id]?.length === 0 && (
                <li
                  style={{
                    textAlign: 'center', color: 'var(--text-secondary)',
                    fontSize: '0.82rem', padding: '1.5rem 0.5rem',
                    border: '2px dashed var(--border-color)', borderRadius: '8px',
                    listStyle: 'none',
                  }}
                >
                  {searchQuery ? 'No matching tasks' : 'Drop tasks here or use + to add'}
                </li>
              )}
            </ul>
          </section>
        ))}
      </div>

      {/* ── Modal (Create/Edit/Delete) ─────────────── */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={confirmDelete ? 'Confirm Delete' : editingTask ? 'Edit Task' : 'Create New Task'}
        triggerRef={addBtnRef}
      >
        {confirmDelete ? (
          <DeleteConfirm
            taskTitle={confirmDelete.title}
            onConfirm={handleDeleteConfirm}
            onCancel={handleModalClose}
          />
        ) : (
          <TaskForm
            onSubmit={handleFormSubmit}
            initialData={editingTask}
            defaultStatus={defaultStatus}
          />
        )}
      </Modal>

      <style>{`
        .sr-only {
          position: absolute; width: 1px; height: 1px;
          padding: 0; margin: -1px; overflow: hidden;
          clip: rect(0,0,0,0); white-space: nowrap; border: 0;
        }
      `}</style>
    </div>
  );
}
