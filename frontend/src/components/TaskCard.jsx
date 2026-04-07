import styles from './TaskCard.module.css';

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return styles.badgeHigh;
      case 'medium': return styles.badgeMedium;
      case 'low': return styles.badgeLow;
      default: return styles.badgeMedium;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed': return styles.badgeCompleted;
      case 'in-progress': return styles.badgeInProgress;
      case 'pending': return styles.badgePending;
      default: return styles.badgePending;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <div className={`${styles.card} ${task.status === 'completed' ? styles.cardCompleted : ''} ${isOverdue ? styles.cardOverdue : ''}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>{task.title}</h3>
        <div className={styles.badges}>
          <span className={`${styles.badge} ${getPriorityClass(task.priority)}`}>
            {task.priority}
          </span>
          <span className={`${styles.badge} ${getStatusClass(task.status)}`}>
            {task.status}
          </span>
        </div>
      </div>

      <p className={styles.description}>
        {task.description || <span className={styles.emptyDesc}>No description provided</span>}
      </p>

      <div className={styles.footer}>
        <div className={`${styles.date} ${isOverdue ? styles.dateOverdue : ''}`}>
          ⏰ {formatDate(task.dueDate)} 
          {isOverdue && <span className={styles.overdueBadge}> (Overdue)</span>}
        </div>
        
        <div className={styles.actions}>
          {task.status !== 'completed' && (
            <button 
              className={styles.actionBtn} 
              title="Mark as completed"
              onClick={() => onStatusChange(task._id, 'completed')}
            >
              ✅
            </button>
          )}
          <button 
            className={styles.actionBtn} 
            title="Edit task"
            onClick={() => onEdit(task)}
          >
            ✏️
          </button>
          <button 
            className={`${styles.actionBtn} ${styles.actionDelete}`} 
            title="Delete task"
            onClick={() => onDelete(task._id)}
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
