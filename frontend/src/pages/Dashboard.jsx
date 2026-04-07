import { useState, useEffect, useMemo, useCallback } from 'react';
import { tasksAPI } from '../api/api';
import { useToast } from '../context/ToastContext';
import Header from '../components/Header';
import TaskStats from '../components/TaskStats';
import TaskFilters from '../components/TaskFilters';
import SearchBar from '../components/SearchBar';
import SortControls from '../components/SortControls';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [editingTask, setEditingTask] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const toast = useToast();

  const fetchTasks = useCallback(async (page = 1, append = false) => {
    try {
      if (append) setLoadingMore(true);
      else setLoading(true);

      const data = await tasksAPI.getAll(page, 10, activeFilter, searchQuery);
      
      if (append) {
        setTasks((prev) => [...prev, ...data.tasks]);
      } else {
        setTasks(data.tasks);
      }
      
      setCurrentPage(data.pagination.currentPage);
      setTotalPages(data.pagination.totalPages);
      setStats(data.stats);
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [activeFilter, searchQuery, toast]);

  useEffect(() => {
    fetchTasks(1, false);
  }, [fetchTasks]);

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      fetchTasks(currentPage + 1, true);
    }
  };

  const handleCreateOrUpdate = async (taskData) => {
    try {
      if (editingTask) {
        const updated = await tasksAPI.update(editingTask._id, taskData);
        setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
        toast.success('Task updated');
        setEditingTask(null);
      } else {
        const created = await tasksAPI.create(taskData);
        // If creating a new task, we refresh the first page to maintain correct ordering
        fetchTasks(1, false);
        toast.success('Task created');
      }
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await tasksAPI.delete(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const updated = await tasksAPI.update(id, { status });
      // If we are filtering by status, removing it from view is usually expected
      if (activeFilter !== 'all' && status !== activeFilter) {
          setTasks((prev) => prev.filter((t) => t._id !== id));
      } else {
          setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
      }
      toast.success('Status updated');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  // We still sort locally for immediate UI feedback on sort change
  const sortedTasks = useMemo(() => {
    let result = [...tasks];

    result.sort((a, b) => {
      let valA, valB;

      if (sortBy === 'dueDate') {
        valA = a.dueDate ? new Date(a.dueDate).getTime() : (sortOrder === 'asc' ? Infinity : -Infinity);
        valB = b.dueDate ? new Date(b.dueDate).getTime() : (sortOrder === 'asc' ? Infinity : -Infinity);
      } else if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        valA = priorityOrder[a.priority] || 0;
        valB = priorityOrder[b.priority] || 0;
      } else if (sortBy === 'title') {
        valA = a.title.toLowerCase();
        valB = b.title.toLowerCase();
      } else {
        valA = new Date(a.createdAt).getTime();
        valB = new Date(b.createdAt).getTime();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [tasks, sortBy, sortOrder]);

  return (
    <div className={styles.dashboard}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.container}>
          <TaskStats stats={stats} />

          <TaskForm 
            onSubmit={handleCreateOrUpdate} 
            initialData={editingTask}
            onCancel={editingTask ? () => setEditingTask(null) : null}
          />

          <div className={styles.toolbar}>
            <div className={styles.toolbarLeft}>
              <TaskFilters 
                activeFilter={activeFilter} 
                onFilterChange={setActiveFilter} 
              />
            </div>
            <div className={styles.toolbarRight}>
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
              <SortControls 
                sortBy={sortBy} 
                sortOrder={sortOrder} 
                onSortChange={setSortBy} 
                onOrderChange={setSortOrder} 
              />
            </div>
          </div>

          {loading && tasks.length === 0 ? (
            <div className={styles.loadingState}>
              <div className="spinner" />
              <p>Loading tasks...</p>
            </div>
          ) : sortedTasks.length > 0 ? (
            <>
              <div className={styles.taskGrid}>
                {sortedTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onEdit={setEditingTask}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
              
              {currentPage < totalPages && (
                <div className={styles.loadMoreContainer}>
                  <button 
                    className={styles.loadMoreBtn} 
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                  >
                    {loadingMore ? 'Loading...' : 'Load More Tasks'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📋</div>
              <h3>No tasks found</h3>
              <p>
                {tasks.length === 0 && !loading
                  ? "You don't have any tasks yet. Create one above!" 
                  : "No tasks match your current filters and search."}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

