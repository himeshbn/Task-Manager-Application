import styles from './SortControls.module.css';

export default function SortControls({ sortBy, sortOrder, onSortChange, onOrderChange }) {
  return (
    <div className={styles.container}>
      <div className={styles.selectWrapper}>
        <select 
          className={styles.select}
          value={sortBy} 
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="createdAt">Date Created</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>
      </div>
      <button 
        className={styles.orderBtn}
        onClick={() => onOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
        title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
      >
        {sortOrder === 'asc' ? '↑' : '↓'}
      </button>
    </div>
  );
}
