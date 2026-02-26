import { useState, useEffect } from 'react';
import styles from './AdminServices.module.scss';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    id: '', heroTitle: '', heroTagline: '', heroImage: '', featuredImage: '',
    description: '', highlights: '', images: '', ctaText: '', ctaButtonLabel: ''
  });

  const API_URL = import.meta.env.VITE_CMS_URL || 'http://localhost:3001';
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await fetch(`${API_URL}/api/services`);
      const data = await response.json();
      setServices(data.data);
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const serviceData = {
      ...formData,
      description: formData.description.split('\n').filter(line => line.trim()),
      highlights: formData.highlights.split('\n').filter(line => line.trim()),
      images: formData.images.split('\n').filter(line => line.trim()),
      cta: { text: formData.ctaText, buttonLabel: formData.ctaButtonLabel }
    };

    try {
      await fetch(`${API_URL}/api/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(serviceData)
      });
      
      setShowForm(false);
      setEditingService(null);
      setFormData({
        id: '', heroTitle: '', heroTagline: '', heroImage: '', featuredImage: '',
        description: '', highlights: '', images: '', ctaText: '', ctaButtonLabel: ''
      });
      loadServices();
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const editService = (service) => {
    setFormData({
      id: service.id,
      heroTitle: service.heroTitle,
      heroTagline: service.heroTagline,
      heroImage: service.heroImage,
      featuredImage: service.featuredImage,
      description: service.description.join('\n'),
      highlights: service.highlights.join('\n'),
      images: service.images.join('\n'),
      ctaText: service.cta.text,
      ctaButtonLabel: service.cta.buttonLabel
    });
    setEditingService(service.id);
    setShowForm(true);
  };

  const deleteService = async (id) => {
    if (!confirm('Delete this service?')) return;
    
    try {
      await fetch(`${API_URL}/api/services/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      loadServices();
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  return (
    <div className={styles.adminServices}>
      <div className={styles.header}>
        <h2>Services Management</h2>
        <button onClick={() => setShowForm(true)} className={styles.addBtn}>
          Add Service
        </button>
      </div>

      <div className={styles.servicesList}>
        {services.map(service => (
          <div key={service.id} className={styles.serviceItem}>
            <div>
              <strong>{service.heroTitle}</strong>
              <br /><small>{service.id}</small>
            </div>
            <div>
              <button onClick={() => editService(service)}>Edit</button>
              <button onClick={() => deleteService(service.id)} className={styles.deleteBtn}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>{editingService ? 'Edit Service' : 'Add Service'}</h3>
            <form onSubmit={handleSubmit}>
              <input
                placeholder="Service ID"
                value={formData.id}
                onChange={(e) => setFormData({...formData, id: e.target.value})}
                required
              />
              <input
                placeholder="Hero Title"
                value={formData.heroTitle}
                onChange={(e) => setFormData({...formData, heroTitle: e.target.value})}
                required
              />
              <input
                placeholder="Hero Tagline"
                value={formData.heroTagline}
                onChange={(e) => setFormData({...formData, heroTagline: e.target.value})}
              />
              <input
                placeholder="Hero Image URL"
                value={formData.heroImage}
                onChange={(e) => setFormData({...formData, heroImage: e.target.value})}
              />
              <input
                placeholder="Featured Image URL"
                value={formData.featuredImage}
                onChange={(e) => setFormData({...formData, featuredImage: e.target.value})}
              />
              <textarea
                placeholder="Description (one per line)"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
              <textarea
                placeholder="Highlights (one per line)"
                value={formData.highlights}
                onChange={(e) => setFormData({...formData, highlights: e.target.value})}
              />
              <textarea
                placeholder="Images (one URL per line)"
                value={formData.images}
                onChange={(e) => setFormData({...formData, images: e.target.value})}
              />
              <input
                placeholder="CTA Text"
                value={formData.ctaText}
                onChange={(e) => setFormData({...formData, ctaText: e.target.value})}
              />
              <input
                placeholder="CTA Button Label"
                value={formData.ctaButtonLabel}
                onChange={(e) => setFormData({...formData, ctaButtonLabel: e.target.value})}
              />
              <div className={styles.formActions}>
                <button type="submit">Save</button>
                <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;