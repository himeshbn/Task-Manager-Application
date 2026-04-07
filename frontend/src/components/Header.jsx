import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import styles from './Header.module.css';

export default function Header() {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <svg className={styles.logoIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <h1 className={styles.title}>Task Manager</h1>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.themeBtn}
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <span className={styles.userName}>{user?.name}</span>
          </div>

          <button className={styles.logoutBtn} onClick={logout}>
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
