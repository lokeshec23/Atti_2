import React, { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';

const initialTasks = [
  { id: '1', title: 'Setup Backend API', desc: 'Initialize FastAPI and connect to MongoDB', status: 'todo', priority: 'high' },
  { id: '2', title: 'Design Database Schema', desc: 'Define users, tasks, and teams collections', status: 'todo', priority: 'medium' },
  { id: '3', title: 'Create Login UI', desc: 'Build the authentication forms', status: 'in-progress', priority: 'high' },
  { id: '4', title: 'Configure Vite', desc: 'Setup Vite with React and necessary plugins', status: 'done', priority: 'low' }
];

export default function TaskBoard() {
  const [tasks, setTasks] = useState(initialTasks);
  const [draggedTaskId, setDraggedTaskId] = useState(null);

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

  const columns = [
    { id: 'todo', title: 'To Do' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'done', title: 'Done' }
  ];

  return (
    <div className="task-board">
      {columns.map(col => (
        <div 
          key={col.id} 
          className="task-column"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, col.id)}
        >
          <div className="column-header">
            <span>{col.title} ({tasks.filter(t => t.status === col.id).length})</span>
            <button className="icon-btn"><MoreHorizontal size={16} /></button>
          </div>
          {tasks.filter(t => t.status === col.id).map(task => (
            <div 
              key={task.id} 
              className="task-card"
              draggable
              onDragStart={(e) => handleDragStart(e, task.id)}
            >
              <h4 className="task-title">{task.title}</h4>
              <p className="task-desc">{task.desc}</p>
              <div className="task-meta">
                <span className={`tag ${task.priority}`}>{task.priority}</span>
                <span>ID: #{task.id}</span>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
