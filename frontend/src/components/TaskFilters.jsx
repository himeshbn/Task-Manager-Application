import styles from './TaskFilters.module.css';

export default function TaskFilters({ activeFilter, onFilterChange }) {
  const filters = [
    { id: 'all', label: 'All Tasks' },
    { id: 'pending', label: 'Pending' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
  ];

  return (
    <div className={styles.filters}>
      {filters.map((filter) => (
        <button
          key={filter.id}
          className={`${styles.filterBtn} ${activeFilter === filter.id ? styles.active : ''}`}
          onClick={() => onFilterChange(filter.id)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
