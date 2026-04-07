import styles from './SearchBar.module.css';

export default function SearchBar({ value, onChange }) {
  return (
    <div className={styles.searchContainer}>
      <span className={styles.icon}>🔍</span>
      <input
        type="text"
        className={styles.input}
        placeholder="Search tasks..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button 
          className={styles.clearBtn} 
          onClick={() => onChange('')}
          title="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}
