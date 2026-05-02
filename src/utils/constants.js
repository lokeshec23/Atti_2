/**
 * Centralized application constants.
 * Using these prevents magic strings scattered across components.
 */

/** localStorage key names */
export const STORAGE_KEYS = {
  USER:          'user',
  USERS:         'registered_users',
  TASKS:         'tasks',
  TEAM_MEMBERS:  'team_members',
  AI_HISTORY:    'ai_chat_history',
  THEME:         'theme_preference',
  NOTIFICATIONS: 'notification_preference',
};

/** Task status values and display labels */
export const TASK_STATUS = {
  TODO:        'todo',
  IN_PROGRESS: 'in-progress',
  DONE:        'done',
};

export const TASK_STATUS_LABELS = {
  [TASK_STATUS.TODO]:        'To Do',
  [TASK_STATUS.IN_PROGRESS]: 'In Progress',
  [TASK_STATUS.DONE]:        'Done',
};

/** Task priority values */
export const PRIORITY = {
  HIGH:   'high',
  MEDIUM: 'medium',
  LOW:    'low',
};

/** Ordered list of task board columns */
export const BOARD_COLUMNS = [
  { id: TASK_STATUS.TODO,        title: 'To Do',       color: 'var(--accent-color)' },
  { id: TASK_STATUS.IN_PROGRESS, title: 'In Progress', color: 'var(--warning)' },
  { id: TASK_STATUS.DONE,        title: 'Done',        color: 'var(--success)' },
];

/** Gemini model to use */
export const GEMINI_MODEL = 'gemini-2.0-flash';

/** Gemini system prompt for the Team AI Assistant */
export const GEMINI_SYSTEM_PROMPT =
  'You are CollabNode\'s Team AI Assistant. ' +
  'You help software teams manage tasks, plan sprints, suggest improvements, ' +
  'summarize activity, and answer productivity questions. ' +
  'Be concise, practical, and friendly. Format lists with bullet points when helpful.';
