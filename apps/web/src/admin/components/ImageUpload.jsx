import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import PropTypes from 'prop-types';
import styles from './ImageUpload.module.scss';

/**
 * ImageUpload Component
 * 
 * A single image upload component with drag-and-drop support, file validation,
 * preview, and upload progress indicator.
 * 
 * @param {Object} props
 * @param {string} props.label - Label for the upload field
 * @param {string} props.name - Field name for form handling
 * @param {string} props.value - Current image URL
 * @param {Function} props.onChange - Callback when image changes (url, name)
 * @param {number} props.maxSize - Maximum file size in bytes (default: 10MB)
 * @param {string[]} props.acceptedTypes - Accepted MIME types
 * @param {boolean} props.required - Whether the field is required
 * @param {string} props.error - Error message to display
 * @param {Function} props.onUpload - Custom upload handler (file) => Promise<url>
 */
const ImageUpload = ({
  label,
  name,
  value = '',
  onChange,
  maxSize = 10485760, // 10MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  required = false,
  error = '',
  onUpload
}) => {
  const [preview, setPreview] = useState(value);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationError, setValidationError] = useState('');

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    // Clear previous errors
    setValidationError('');

    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setValidationError(`File size exceeds maximum allowed size of ${(maxSize / 1048576).toFixed(0)}MB`);
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setValidationError('Invalid file type. Please upload an image file (JPEG, PNG, GIF, or WebP)');
      } else {
        setValidationError('File validation failed');
      }
      return;
    }

    if (acceptedFiles.length === 0) {
      return;
    }

    const file = acceptedFiles[0];

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload file if handler provided
    if (onUpload) {
      try {
        setUploading(true);
        setUploadProgress(0);

        // Simulate progress (in real implementation, use XMLHttpRequest or fetch with progress)
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 100);

        const imageUrl = await onUpload(file);
        
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        if (onChange) {
          onChange(imageUrl, name);
        }
        
        setPreview(imageUrl);
        
        // Reset progress after a short delay
        setTimeout(() => {
          setUploading(false);
          setUploadProgress(0);
        }, 500);
      } catch (err) {
        setValidationError(err.message || 'Upload failed. Please try again.');
        setUploading(false);
        setUploadProgress(0);
        setPreview('');
      }
    } else {
      // No upload handler - just use the data URL
      if (onChange) {
        onChange(reader.result, name);
      }
    }
  }, [maxSize, name, onChange, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize,
    multiple: false,
    disabled: uploading
  });

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreview('');
    setValidationError('');
    if (onChange) {
      onChange('', name);
    }
  };

  const displayError = error || validationError;

  return (
    <div className={`${styles.imageUpload} ${displayError ? styles.hasError : ''}`}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <div
        {...getRootProps()}
        className={`${styles.dropzone} ${isDragActive ? styles.dragActive : ''} ${uploading ? styles.uploading : ''} ${preview ? styles.hasPreview : ''}`}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className={styles.previewContainer}>
            <img src={preview} alt="Preview" className={styles.preview} />
            <div className={styles.previewOverlay}>
              <button
                type="button"
                onClick={handleRemove}
                className={styles.removeButton}
                disabled={uploading}
                aria-label="Remove image"
              >
                ✕ Remove
              </button>
              <button
                type="button"
                className={styles.replaceButton}
                disabled={uploading}
                aria-label="Replace image"
              >
                ↻ Replace
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.placeholder}>
            <div className={styles.uploadIcon}>📁</div>
            <p className={styles.uploadText}>
              {isDragActive ? (
                'Drop image here'
              ) : (
                <>
                  Drag & drop an image here, or <span className={styles.browseText}>browse</span>
                </>
              )}
            </p>
            <p className={styles.uploadHint}>
              Supported formats: JPEG, PNG, GIF, WebP (max {(maxSize / 1048576).toFixed(0)}MB)
            </p>
          </div>
        )}

        {uploading && (
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className={styles.progressText}>Uploading... {uploadProgress}%</p>
          </div>
        )}
      </div>

      {displayError && (
        <span className={styles.error} role="alert">
          {displayError}
        </span>
      )}
    </div>
  );
};

ImageUpload.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
  maxSize: PropTypes.number,
  acceptedTypes: PropTypes.arrayOf(PropTypes.string),
  required: PropTypes.bool,
  error: PropTypes.string,
  onUpload: PropTypes.func
};

export default ImageUpload;
