import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import ConfirmDialog from '../../components/AdminFormFields/ConfirmDialog';
import styles from './MediaLibrary.module.scss';

/**
 * MediaLibrary Component
 * 
 * A media library browser for viewing, searching, selecting, and managing uploaded images.
 * Supports two modes: 'select' for choosing images to insert into content, and 'manage' for
 * full media management with delete capabilities.
 * 
 * @param {Object} props
 * @param {string} props.mode - Display mode: 'select' or 'manage'
 * @param {Function} props.onSelect - Callback when image(s) selected (url or urls array)
 * @param {boolean} props.multiSelect - Allow selecting multiple images
 * @param {string} props.token - JWT token for authenticated requests
 * @param {Function} props.onClose - Callback to close the media library
 */
const MediaLibrary = ({
  mode = 'manage',
  onSelect,
  multiSelect = false,
  token,
  onClose
}) => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const itemsPerPage = 50;

  // Fetch media from API
  const fetchMedia = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        ...(searchQuery && { search: searchQuery })
      });

      const response = await fetch(`/api/media?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to load media');
      }

      setMedia(data.data.media);
      setTotalPages(data.data.totalPages);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load media library');
      setLoading(false);
    }
  }, [currentPage, searchQuery, token]);

  useEffect(() => {
    if (token) {
      fetchMedia();
    }
  }, [fetchMedia, token]);

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMedia();
  };

  // Handle image selection
  const handleImageClick = (mediaItem) => {
    if (mode === 'select') {
      if (multiSelect) {
        const newSelected = new Set(selectedImages);
        if (newSelected.has(mediaItem.id)) {
          newSelected.delete(mediaItem.id);
        } else {
          newSelected.add(mediaItem.id);
        }
        setSelectedImages(newSelected);
      } else {
        // Single select - immediately call onSelect and close
        if (onSelect) {
          onSelect(mediaItem.urls.original);
        }
        if (onClose) {
          onClose();
        }
      }
    }
  };

  // Handle confirm selection (for multi-select)
  const handleConfirmSelection = () => {
    if (mode === 'select' && multiSelect && onSelect) {
      const selectedUrls = media
        .filter(item => selectedImages.has(item.id))
        .map(item => item.urls.original);
      onSelect(selectedUrls);
    }
    if (onClose) {
      onClose();
    }
  };

  // Handle delete request
  const handleDeleteClick = (mediaItem, e) => {
    e.stopPropagation();
    setDeleteConfirm(mediaItem);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    setDeleting(true);
    setError('');

    try {
      const response = await fetch(`/api/media/${deleteConfirm.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to delete image');
      }

      // Remove from local state
      setMedia(prev => prev.filter(item => item.id !== deleteConfirm.id));
      setDeleteConfirm(null);
      setDeleting(false);

      // Refresh if page is now empty
      if (media.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      } else if (media.length === 1) {
        fetchMedia();
      }
    } catch (err) {
      setError(err.message || 'Failed to delete image');
      setDeleting(false);
    }
  };

  // Handle pagination
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={styles.mediaLibrary}>
      <div className={styles.header}>
        <h2 className={styles.title}>Media Library</h2>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close media library"
          >
            ✕
          </button>
        )}
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by filename..."
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>
          Search
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className={styles.errorMessage} role="alert">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p>Loading media...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && media.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📁</div>
          <p className={styles.emptyText}>
            {searchQuery ? 'No images found matching your search' : 'No images in media library'}
          </p>
        </div>
      )}

      {/* Media Grid */}
      {!loading && media.length > 0 && (
        <>
          <div className={styles.mediaGrid}>
            {media.map((item) => {
              const isSelected = selectedImages.has(item.id);
              return (
                <div
                  key={item.id}
                  className={`${styles.mediaCard} ${isSelected ? styles.selected : ''} ${mode === 'select' ? styles.selectable : ''}`}
                  onClick={() => handleImageClick(item)}
                  role={mode === 'select' ? 'button' : undefined}
                  tabIndex={mode === 'select' ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (mode === 'select' && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      handleImageClick(item);
                    }
                  }}
                >
                  <div className={styles.imageContainer}>
                    <img
                      src={item.urls.thumbnail || item.urls.original}
                      alt={item.originalName}
                      className={styles.thumbnail}
                      loading="lazy"
                    />
                    {isSelected && (
                      <div className={styles.selectedOverlay}>
                        <div className={styles.checkmark}>✓</div>
                      </div>
                    )}
                  </div>

                  <div className={styles.metadata}>
                    <p className={styles.filename} title={item.originalName}>
                      {item.originalName}
                    </p>
                    <div className={styles.metaInfo}>
                      <span className={styles.metaItem}>
                        {formatDate(item.uploadedAt)}
                      </span>
                      <span className={styles.metaItem}>
                        {formatFileSize(item.fileSize)}
                      </span>
                    </div>
                  </div>

                  {mode === 'manage' && (
                    <button
                      type="button"
                      onClick={(e) => handleDeleteClick(item, e)}
                      className={styles.deleteButton}
                      aria-label={`Delete ${item.originalName}`}
                    >
                      🗑️
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                type="button"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={styles.paginationButton}
                aria-label="Previous page"
              >
                ← Previous
              </button>
              <span className={styles.paginationInfo}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={styles.paginationButton}
                aria-label="Next page"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* Selection Actions (for multi-select mode) */}
      {mode === 'select' && multiSelect && selectedImages.size > 0 && (
        <div className={styles.selectionActions}>
          <p className={styles.selectionCount}>
            {selectedImages.size} image{selectedImages.size !== 1 ? 's' : ''} selected
          </p>
          <div className={styles.actionButtons}>
            <button
              type="button"
              onClick={() => setSelectedImages(new Set())}
              className={styles.clearButton}
            >
              Clear Selection
            </button>
            <button
              type="button"
              onClick={handleConfirmSelection}
              className={styles.confirmButton}
            >
              Insert Selected
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        title="Delete Image"
        message={`Are you sure you want to delete "${deleteConfirm?.originalName}"? This action cannot be undone.`}
        confirmText={deleting ? 'Deleting...' : 'Delete'}
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm(null)}
        variant="danger"
      />
    </div>
  );
};

MediaLibrary.propTypes = {
  mode: PropTypes.oneOf(['select', 'manage']),
  onSelect: PropTypes.func,
  multiSelect: PropTypes.bool,
  token: PropTypes.string,
  onClose: PropTypes.func
};

export default MediaLibrary;
