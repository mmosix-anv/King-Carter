import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import PropTypes from 'prop-types';
import styles from './GalleryUpload.module.scss';

/**
 * GalleryUpload Component
 * 
 * A multiple image upload component with drag-and-drop support, reordering,
 * batch upload with progress tracking, and queue management.
 * 
 * @param {Object} props
 * @param {string} props.label - Label for the upload field
 * @param {string} props.name - Field name for form handling
 * @param {string[]} props.value - Array of current image URLs
 * @param {Function} props.onChange - Callback when images change (urls, name)
 * @param {number} props.maxSize - Maximum file size in bytes (default: 10MB)
 * @param {string[]} props.acceptedTypes - Accepted MIME types
 * @param {boolean} props.required - Whether the field is required
 * @param {string} props.error - Error message to display
 * @param {Function} props.onUpload - Custom upload handler (files) => Promise<urls[]>
 * @param {number} props.maxFiles - Maximum number of files allowed
 */
const GalleryUpload = ({
  label,
  name,
  value = [],
  onChange,
  maxSize = 10485760, // 10MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  required = false,
  error = '',
  onUpload,
  maxFiles = 20
}) => {
  const [uploadQueue, setUploadQueue] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [validationError, setValidationError] = useState('');
  const [draggedIndex, setDraggedIndex] = useState(null);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Clear previous errors
    setValidationError('');

    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setValidationError(`File size exceeds maximum allowed size of ${(maxSize / 1048576).toFixed(0)}MB`);
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setValidationError('Invalid file type. Please upload image files (JPEG, PNG, GIF, or WebP)');
      } else if (rejection.errors[0]?.code === 'too-many-files') {
        setValidationError(`Maximum ${maxFiles} files allowed`);
      } else {
        setValidationError('File validation failed');
      }
      return;
    }

    if (acceptedFiles.length === 0) {
      return;
    }

    // Check if adding these files would exceed maxFiles
    const totalFiles = value.length + uploadQueue.length + acceptedFiles.length;
    if (totalFiles > maxFiles) {
      setValidationError(`Maximum ${maxFiles} files allowed. You can add ${maxFiles - value.length - uploadQueue.length} more.`);
      return;
    }

    // Create queue items with previews
    const newQueueItems = acceptedFiles.map((file, index) => {
      const id = `${Date.now()}-${index}`;
      const reader = new FileReader();
      
      return new Promise((resolve) => {
        reader.onload = () => {
          resolve({
            id,
            file,
            preview: reader.result,
            status: 'pending' // pending, uploading, complete, error
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newQueueItems).then(items => {
      setUploadQueue(prev => [...prev, ...items]);
    });
  }, [maxSize, maxFiles, value.length, uploadQueue.length]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize,
    multiple: true,
    disabled: uploading
  });

  const handleRemoveFromQueue = (id) => {
    setUploadQueue(prev => prev.filter(item => item.id !== id));
  };

  const handleRemoveUploaded = (index) => {
    const newUrls = [...value];
    newUrls.splice(index, 1);
    if (onChange) {
      onChange(newUrls, name);
    }
  };

  const handleUploadAll = async () => {
    if (!onUpload || uploadQueue.length === 0) {
      return;
    }

    setUploading(true);
    setValidationError('');

    try {
      const files = uploadQueue.map(item => item.file);
      
      // Initialize progress for each file
      const initialProgress = {};
      uploadQueue.forEach(item => {
        initialProgress[item.id] = 0;
      });
      setUploadProgress(initialProgress);

      // Update queue status to uploading
      setUploadQueue(prev => prev.map(item => ({ ...item, status: 'uploading' })));

      // Simulate progress (in real implementation, track actual upload progress)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(key => {
            if (updated[key] < 90) {
              updated[key] = Math.min(90, updated[key] + 10);
            }
          });
          return updated;
        });
      }, 200);

      // Upload all files
      const uploadedUrls = await onUpload(files);
      
      clearInterval(progressInterval);

      // Set all progress to 100%
      const completeProgress = {};
      uploadQueue.forEach(item => {
        completeProgress[item.id] = 100;
      });
      setUploadProgress(completeProgress);

      // Update queue status to complete
      setUploadQueue(prev => prev.map(item => ({ ...item, status: 'complete' })));

      // Update parent with new URLs
      if (onChange) {
        onChange([...value, ...uploadedUrls], name);
      }

      // Clear queue after a short delay
      setTimeout(() => {
        setUploadQueue([]);
        setUploadProgress({});
        setUploading(false);
      }, 1000);

    } catch (err) {
      setValidationError(err.message || 'Upload failed. Please try again.');
      setUploadQueue(prev => prev.map(item => ({ ...item, status: 'error' })));
      setUploading(false);
    }
  };

  // Drag and drop reordering for uploaded images
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) {
      return;
    }

    const newUrls = [...value];
    const draggedItem = newUrls[draggedIndex];
    newUrls.splice(draggedIndex, 1);
    newUrls.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    if (onChange) {
      onChange(newUrls, name);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Drag and drop reordering for queue items
  const [draggedQueueIndex, setDraggedQueueIndex] = useState(null);

  const handleQueueDragStart = (index) => {
    setDraggedQueueIndex(index);
  };

  const handleQueueDragOver = (e, index) => {
    e.preventDefault();
    if (draggedQueueIndex === null || draggedQueueIndex === index) {
      return;
    }

    const newQueue = [...uploadQueue];
    const draggedItem = newQueue[draggedQueueIndex];
    newQueue.splice(draggedQueueIndex, 1);
    newQueue.splice(index, 0, draggedItem);

    setDraggedQueueIndex(index);
    setUploadQueue(newQueue);
  };

  const handleQueueDragEnd = () => {
    setDraggedQueueIndex(null);
  };

  const displayError = error || validationError;
  const hasImages = value.length > 0;
  const hasQueue = uploadQueue.length > 0;

  return (
    <div className={`${styles.galleryUpload} ${displayError ? styles.hasError : ''}`}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      {/* Uploaded Images Grid */}
      {hasImages && (
        <div className={styles.uploadedGrid}>
          {value.map((url, index) => (
            <div
              key={`uploaded-${index}`}
              className={`${styles.imageCard} ${draggedIndex === index ? styles.dragging : ''}`}
              draggable={!uploading}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
            >
              <img src={url} alt={`Uploaded ${index + 1}`} className={styles.thumbnail} />
              <button
                type="button"
                onClick={() => handleRemoveUploaded(index)}
                className={styles.removeButton}
                disabled={uploading}
                aria-label={`Remove image ${index + 1}`}
              >
                ✕
              </button>
              <div className={styles.dragHandle}>⋮⋮</div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Queue */}
      {hasQueue && (
        <div className={styles.queueSection}>
          <div className={styles.queueHeader}>
            <h4 className={styles.queueTitle}>Upload Queue ({uploadQueue.length})</h4>
            <button
              type="button"
              onClick={handleUploadAll}
              className={styles.uploadButton}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload All'}
            </button>
          </div>
          <div className={styles.queueGrid}>
            {uploadQueue.map((item, index) => (
              <div
                key={item.id}
                className={`${styles.queueCard} ${styles[item.status]} ${draggedQueueIndex === index ? styles.dragging : ''}`}
                draggable={!uploading}
                onDragStart={() => handleQueueDragStart(index)}
                onDragOver={(e) => handleQueueDragOver(e, index)}
                onDragEnd={handleQueueDragEnd}
              >
                <img src={item.preview} alt={item.file.name} className={styles.thumbnail} />
                <div className={styles.queueInfo}>
                  <p className={styles.fileName}>{item.file.name}</p>
                  <p className={styles.fileSize}>
                    {(item.file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                {item.status === 'uploading' && (
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill}
                      style={{ width: `${uploadProgress[item.id] || 0}%` }}
                    />
                  </div>
                )}
                {item.status === 'complete' && (
                  <div className={styles.statusIcon}>✓</div>
                )}
                {item.status === 'error' && (
                  <div className={styles.statusIcon}>✗</div>
                )}
                {item.status === 'pending' && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFromQueue(item.id)}
                    className={styles.removeQueueButton}
                    aria-label={`Remove ${item.file.name} from queue`}
                  >
                    ✕
                  </button>
                )}
                <div className={styles.dragHandle}>⋮⋮</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`${styles.dropzone} ${isDragActive ? styles.dragActive : ''} ${uploading ? styles.uploading : ''}`}
      >
        <input {...getInputProps()} />
        <div className={styles.placeholder}>
          <div className={styles.uploadIcon}>📁</div>
          <p className={styles.uploadText}>
            {isDragActive ? (
              'Drop images here'
            ) : (
              <>
                Drag & drop images here, or <span className={styles.browseText}>browse</span>
              </>
            )}
          </p>
          <p className={styles.uploadHint}>
            Supported formats: JPEG, PNG, GIF, WebP (max {(maxSize / 1048576).toFixed(0)}MB per file, {maxFiles} files max)
          </p>
          {hasImages && (
            <p className={styles.uploadCount}>
              {value.length} image{value.length !== 1 ? 's' : ''} uploaded
            </p>
          )}
        </div>
      </div>

      {displayError && (
        <span className={styles.error} role="alert">
          {displayError}
        </span>
      )}
    </div>
  );
};

GalleryUpload.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
  maxSize: PropTypes.number,
  acceptedTypes: PropTypes.arrayOf(PropTypes.string),
  required: PropTypes.bool,
  error: PropTypes.string,
  onUpload: PropTypes.func,
  maxFiles: PropTypes.number
};

export default GalleryUpload;
