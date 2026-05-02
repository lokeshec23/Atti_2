import React, { useState, useEffect } from 'react';
import { MoreHorizontal, Plus } from 'lucide-react';

const initialTasks = [
  { id: '1', title: 'Setup Frontend', desc: 'Initialize Vite and React', status: 'todo', priority: 'high' },
  { id: '2', title: 'Design Database Schema', desc: 'Define local storage structure', status: 'todo', priority: 'medium' },
  { id: '3', title: 'Create Login UI', desc: 'Build minimal auth forms', status: 'in-progress', priority: 'high' },
  { id: '4', title: 'Configure Components', desc: 'Setup basic layout components', status: 'done', priority: 'low' }
];

export default function TaskBoard() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });
  const [draggedTaskId, setDraggedTaskId] = useState(null);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleDragStart = (e, id) => {
    setDraggedTaskId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // necessary to allow dropping
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    if (draggedTaskId) {
      setTasks(tasks.map(task => 
        task.id === draggedTaskId ? { ...task, status } : task
      ));
      setDraggedTaskId(null);
    }
  };

  const handleAddTask = (status) => {
    const title = prompt("Enter task title:");
    if (!title) return;
    const desc = prompt("Enter task description:") || "No description";
    const priority = prompt("Enter priority (low, medium, high):", "medium") || "medium";
    
    const newTask = {
      id: Date.now().toString(),
      title,
      desc,
      status,
      priority
    };
    
    setTasks([...tasks, newTask]);
  };

  const columns = [
    { id: 'todo', title: 'To Do' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'done', title: 'Done' }
  ];

  return (
    <div className="task-board" style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', padding: '1rem', height: '100%' }}>
      {columns.map(col => (
        <div 
          key={col.id} 
          className="task-column"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, col.id)}
          style={{ 
            background: 'var(--surface-color)', 
            minWidth: '320px', 
            borderRadius: '8px', 
            padding: '1rem', 
            display: 'flex', 
            flexDirection: 'column', 
            border: '1px solid var(--border-color)' 
          }}
        >
          <div className="column-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontWeight: 600 }}>
            <span>{col.title} ({tasks.filter(t => t.status === col.id).length})</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="icon-btn" onClick={() => handleAddTask(col.id)} title="Add Task"><Plus size={16} /></button>
              <button className="icon-btn"><MoreHorizontal size={16} /></button>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, overflowY: 'auto' }}>
            {tasks.filter(t => t.status === col.id).map(task => (
              <div 
                key={task.id} 
                className="task-card"
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
                style={{
                  background: 'var(--bg-color)',
                  padding: '1rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  cursor: 'grab',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                <h4 className="task-title" style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>{task.title}</h4>
                <p className="task-desc" style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{task.desc}</p>
                <div className="task-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                  <span className={`tag ${task.priority}`} style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '1rem',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    background: task.priority === 'high' ? 'var(--danger)' : task.priority === 'medium' ? 'var(--warning)' : 'var(--success)',
                    color: 'white'
                  }}>
                    {task.priority}
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>ID: #{task.id.slice(-4)}</span>
                </div>
              </div>
            ))}
            
            <button 
              onClick={() => handleAddTask(col.id)}
              style={{
                background: 'transparent',
                border: '1px dashed var(--border-color)',
                padding: '1rem',
                borderRadius: '6px',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'var(--transition)'
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--accent-color)'; e.currentTarget.style.color = 'var(--accent-color)'; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              <Plus size={16} /> Add Task
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
