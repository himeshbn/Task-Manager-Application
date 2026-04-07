import { useState, useEffect } from 'react';
import styles from './TaskForm.module.css';

export default function TaskForm({ onSubmit, initialData = null, onCancel = null }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        status: initialData.status || 'pending',
        priority: initialData.priority || 'medium',
        dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        dueDate: '',
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    if (!initialData) {
      setFormData({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        dueDate: '',
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.formCard}>
      <h2 className={styles.heading}>{initialData ? 'Edit Task' : 'Create New Task'}</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.row}>
          <div className={`${styles.field} ${styles.flex2}`}>
            <label htmlFor="title">Task Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="What needs to be done?"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="priority">Priority</label>
            <div className={styles.selectWrapper}>
              <select id="priority" name="priority" value={formData.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className={styles.field}>
            <label htmlFor="status">Status</label>
            <div className={styles.selectWrapper}>
              <select id="status" name="status" value={formData.status} onChange={handleChange}>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        <div className={styles.row}>
          <div className={`${styles.field} ${styles.flex2}`}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows={2}
              placeholder="Add details..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="dueDate">Due Date</label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.actions}>
          {onCancel && (
            <button type="button" className={styles.cancelBtn} onClick={onCancel}>
              Cancel
            </button>
          )}
          <button type="submit" className={styles.submitBtn}>
            {initialData ? 'Update Task' : 'Add Task'}
          </button>
        </div>
      </form>
    </div>
  );
}
