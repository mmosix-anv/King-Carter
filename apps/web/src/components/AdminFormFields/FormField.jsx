import PropTypes from 'prop-types';
import styles from './FormField.module.scss';

const FormField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder, 
  type = 'text',
  required = false,
  error = '',
  disabled = false,
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
      <input
        id={name}
        name={name}
        type={type}
        value={value || ''}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
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

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  maxLength: PropTypes.number,
  className: PropTypes.string
};

export default FormField;
