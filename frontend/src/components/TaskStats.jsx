import styles from './TaskStats.module.css';

export default function TaskStats({ stats }) {
  const { total, pending, inProgress, completed } = stats;

  const statsList = [
    { label: 'Total', value: total, color: 'accent', icon: '📋' },
    { label: 'Pending', value: pending, color: 'warning', icon: '⏳' },
    { label: 'In Progress', value: inProgress, color: 'info', icon: '🔄' },
    { label: 'Completed', value: completed, color: 'success', icon: '✅' },
  ];

  return (
    <div className={styles.grid}>
      {statsList.map((stat) => (
        <div key={stat.label} className={`${styles.card} ${styles[stat.color]}`}>
          <div className={styles.iconWrap}>
            <span>{stat.icon}</span>
          </div>
          <div className={styles.info}>
            <div className={styles.value}>{stat.value}</div>
            <div className={styles.label}>{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
