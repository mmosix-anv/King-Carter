import PropTypes from 'prop-types';
import styles from './FormField.module.scss';

const TextArea = ({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  error = '',
  disabled = false,
  rows = 4,
  maxLength,
  className = ''
}) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value, name);
    }
  };

  return (
    <div className={`${styles.field} ${className}`}>
      <label htmlFor={name} className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
        {maxLength && value && (
          <span className={styles.charCount}>
            {value.length}/{maxLength}
          </span>
        )}
      </label>
      <textarea
        id={name}
        name={name}
        value={value || ''}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={`${styles.textarea} ${error ? styles.inputError : ''}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <span id={`${name}-error`} className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

TextArea.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  rows: PropTypes.number,
  maxLength: PropTypes.number,
  className: PropTypes.string
};

export default TextArea;
