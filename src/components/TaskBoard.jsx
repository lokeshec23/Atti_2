import React, { useState, useCallback, useMemo } from 'react';
import { MoreHorizontal, Plus, Edit2, Trash2, Search } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import Modal from './Modal';
import TaskForm from './TaskForm';

const initialTasks = [
  { id: '1', title: 'Setup Frontend', desc: 'Initialize Vite and React', status: 'todo', priority: 'high' },
  { id: '2', title: 'Design Database Schema', desc: 'Define local storage structure', status: 'todo', priority: 'medium' },
  { id: '3', title: 'Create Login UI', desc: 'Build minimal auth forms', status: 'in-progress', priority: 'high' },
  { id: '4', title: 'Configure Components', desc: 'Setup basic layout components', status: 'done', priority: 'low' }
];

export default function TaskBoard() {
  const [tasks, setTasks] = useLocalStorage('tasks', initialTasks);
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tasks, searchQuery]);

  const handleDragStart = useCallback((e, id) => {
    setDraggedTaskId(id);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e, status) => {
    e.preventDefault();
    if (draggedTaskId) {
      setTasks(prev => prev.map(task => 
        task.id === draggedTaskId ? { ...task, status } : task
      ));
      setDraggedTaskId(null);
    }
  }, [draggedTaskId, setTasks]);

  const handleAddTask = (status = 'todo') => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleFormSubmit = (data) => {
    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...data, id: t.id } : t));
    } else {
      const newTask = {
        ...data,
        id: Date.now().toString()
      };
      setTasks(prev => [...prev, newTask]);
    }
    setIsModalOpen(false);
  };

  const columns = [
    { id: 'todo', title: 'To Do', color: 'var(--accent-color)' },
    { id: 'in-progress', title: 'In Progress', color: 'var(--warning)' },
    { id: 'done', title: 'Done', color: 'var(--success)' }
  ];

  return (
    <div className="task-board-container" style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="board-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Project Board</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Manage and track team tasks</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '0.5rem 0.75rem 0.5rem 2.25rem',
                borderRadius: '20px',
                border: '1px solid var(--border-color)',
                background: 'var(--surface-color)',
                color: 'var(--text-color)',
                width: '240px'
              }}
            />
          </div>
          <button 
            className="primary-btn" 
            onClick={() => handleAddTask()}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', borderRadius: '8px', background: 'var(--accent-color)', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer' }}
          >
            <Plus size={18} /> New Task
          </button>
        </div>
      </div>

      <div className="task-board" style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', flex: 1, paddingBottom: '1rem' }}>
        {columns.map(col => (
          <div 
            key={col.id} 
            className="task-column"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
            style={{ 
              background: 'var(--surface-color)', 
              minWidth: '320px', 
              borderRadius: '12px', 
              padding: '1.25rem', 
              display: 'flex', 
              flexDirection: 'column', 
              border: '1px solid var(--border-color)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div className="column-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: col.color }}></span>
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{col.title}</span>
                <span style={{ background: 'var(--bg-color)', padding: '0.1rem 0.5rem', borderRadius: '10px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {filteredTasks.filter(t => t.status === col.id).length}
                </span>
              </div>
              <button className="icon-btn" onClick={() => handleAddTask(col.id)}><Plus size={16} /></button>
            </div>

            <div className="task-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, overflowY: 'auto', minHeight: '100px' }}>
              {filteredTasks.filter(t => t.status === col.id).map(task => (
                <div 
                  key={task.id} 
                  className="task-card"
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  style={{
                    background: 'var(--bg-color)',
                    padding: '1.25rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    cursor: 'grab',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    position: 'relative',
                    group: 'task'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{task.title}</h4>
                    <div className="task-actions" style={{ display: 'flex', gap: '0.25rem' }}>
                      <button 
                        onClick={() => handleEditTask(task)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.25rem' }}
                        title="Edit Task"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDeleteTask(task.id)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.25rem' }}
                        title="Delete Task"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5 }}>{task.desc}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ 
                      padding: '0.2rem 0.6rem', 
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      background: task.priority === 'high' ? 'rgba(239, 68, 68, 0.1)' : task.priority === 'medium' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                      color: task.priority === 'high' ? 'var(--danger)' : task.priority === 'medium' ? 'var(--warning)' : 'var(--success)'
                    }}>
                      {task.priority}
                    </span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>#{task.id.slice(-4)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingTask ? 'Edit Task' : 'Create New Task'}
      >
        <TaskForm onSubmit={handleFormSubmit} initialData={editingTask} />
      </Modal>
    </div>
  );
}
