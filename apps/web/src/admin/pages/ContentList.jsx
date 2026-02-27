import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../../components/AdminFormFields/ConfirmDialog';
import styles from './ContentList.module.scss';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const ContentList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, serviceId: null, serviceName: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, [statusFilter]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const url = statusFilter === 'all' 
        ? `${API_BASE_URL}/api/services` 
        : `${API_BASE_URL}/api/services?status=${statusFilter}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }

      const result = await response.json();
      // Convert object to array
      const servicesArray = Object.values(result.data || {});
      setServices(servicesArray);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/services/${deleteDialog.serviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete service');
      }

      // Refresh the list after successful deletion
      await fetchServices();
      setDeleteDialog({ isOpen: false, serviceId: null, serviceName: '' });
    } catch (err) {
      setError(err.message);
      console.error('Error deleting service:', err);
    }
  };

  const openDeleteDialog = (service) => {
    setDeleteDialog({
      isOpen: true,
      serviceId: service.id,
      serviceName: service.heroTitle || service.id
    });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ isOpen: false, serviceId: null, serviceName: '' });
  };

  const filteredServices = services.filter(service => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      service.heroTitle?.toLowerCase().includes(query) ||
      service.id?.toLowerCase().includes(query)
    );
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return <div className={styles.loading}>Loading services...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Content Management</h1>
        <button 
          className={styles.createButton}
          onClick={() => navigate('/admin/content/new')}
        >
          Create New Service
        </button>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search by title or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterBox}>
          <label htmlFor="status-filter">Status:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          Error: {error}
        </div>
      )}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>ID</th>
              <th>Status</th>
              <th>Last Modified</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.length === 0 ? (
              <tr>
                <td colSpan="5" className={styles.emptyState}>
                  No services found
                </td>
              </tr>
            ) : (
              filteredServices.map((service) => (
                <tr key={service.id}>
                  <td className={styles.titleCell}>{service.heroTitle || 'Untitled'}</td>
                  <td>{service.id}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[service.status]}`}>
                      {service.status || 'draft'}
                    </span>
                  </td>
                  <td>{formatDate(service.updatedAt)}</td>
                  <td className={styles.actionsCell}>
                    <button
                      className={styles.editButton}
                      onClick={() => navigate(`/admin/content/${service.id}`)}
                      title="Edit service"
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => openDeleteDialog(service)}
                      title="Delete service"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Service"
        message={`Are you sure you want to delete "${deleteDialog.serviceName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={closeDeleteDialog}
      />
    </div>
  );
};

export default ContentList;
