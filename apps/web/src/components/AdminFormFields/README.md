# Admin Form Field Components

Reusable form field components for the admin panel with built-in validation display and error messages.

## Components

### LoadingSpinner
A loading spinner component with optional overlay mode for async operations.

**Props:**
- `overlay` (boolean): Display as full-screen overlay (default: false)
- `size` (string): Spinner size - 'small', 'medium', or 'large' (default: 'medium')
- `message` (string): Optional loading message to display

**Example:**
```jsx
import { LoadingSpinner } from '../../components/AdminFormFields';

// Inline spinner
<LoadingSpinner size="small" />

// Full-screen overlay with message
<LoadingSpinner 
  overlay={true} 
  message="Uploading images..." 
/>
```

### ConfirmDialog
A modal dialog for confirming destructive actions like deletions.

**Props:**
- `isOpen` (boolean, required): Controls dialog visibility
- `title` (string, required): Dialog title
- `message` (string, required): Confirmation message
- `confirmText` (string): Confirm button text (default: 'Confirm')
- `cancelText` (string): Cancel button text (default: 'Cancel')
- `onConfirm` (function, required): Callback when confirmed
- `onCancel` (function, required): Callback when cancelled
- `variant` (string): Button style - 'danger', 'warning', or 'info' (default: 'danger')

**Example:**
```jsx
import { ConfirmDialog } from '../../components/AdminFormFields';

const [showDialog, setShowDialog] = useState(false);

<ConfirmDialog
  isOpen={showDialog}
  title="Delete Content"
  message="Are you sure you want to delete this content? This action cannot be undone."
  confirmText="Delete"
  cancelText="Cancel"
  onConfirm={() => {
    handleDelete();
    setShowDialog(false);
  }}
  onCancel={() => setShowDialog(false)}
  variant="danger"
/>
```

### FormField
A text input component with label, validation, and error display.

**Props:**
- `label` (string, required): Label text for the field
- `name` (string, required): Field name/identifier
- `value` (string): Current field value
- `onChange` (function): Callback function `(value, name) => void`
- `placeholder` (string): Placeholder text
- `type` (string): Input type (default: 'text')
- `required` (boolean): Show required indicator
- `error` (string): Error message to display
- `disabled` (boolean): Disable the field
- `maxLength` (number): Maximum character length with counter
- `className` (string): Additional CSS classes

**Example:**
```jsx
import { FormField } from '../../components/AdminFormFields';

<FormField
  label="Site Title"
  name="siteTitle"
  value={settings.siteTitle}
  onChange={(value, name) => updateSetting(name, value)}
  placeholder="Enter site title"
  required={true}
  maxLength={60}
  error={errors.siteTitle}
/>
```

### TextArea
A multi-line text input component with label, validation, and error display.

**Props:**
- `label` (string, required): Label text for the field
- `name` (string, required): Field name/identifier
- `value` (string): Current field value
- `onChange` (function): Callback function `(value, name) => void`
- `placeholder` (string): Placeholder text
- `required` (boolean): Show required indicator
- `error` (string): Error message to display
- `disabled` (boolean): Disable the field
- `rows` (number): Number of visible text rows (default: 4)
- `maxLength` (number): Maximum character length with counter
- `className` (string): Additional CSS classes

**Example:**
```jsx
import { TextArea } from '../../components/AdminFormFields';

<TextArea
  label="Meta Description"
  name="metaDescription"
  value={settings.metaDescription}
  onChange={(value, name) => updateSetting(name, value)}
  placeholder="Enter meta description"
  required={true}
  maxLength={160}
  rows={3}
  error={errors.metaDescription}
/>
```

### Select
A dropdown select component with label, validation, and error display.

**Props:**
- `label` (string, required): Label text for the field
- `name` (string, required): Field name/identifier
- `value` (string): Currently selected value
- `onChange` (function): Callback function `(value, name) => void`
- `options` (array): Array of options (strings or objects with `value` and `label`)
- `required` (boolean): Show required indicator
- `error` (string): Error message to display
- `disabled` (boolean): Disable the field
- `placeholder` (string): Placeholder option text
- `className` (string): Additional CSS classes

**Example with string array:**
```jsx
import { Select } from '../../components/AdminFormFields';

<Select
  label="Status"
  name="status"
  value={content.status}
  onChange={(value, name) => updateContent(name, value)}
  options={['draft', 'published']}
  required={true}
  error={errors.status}
/>
```

**Example with object array:**
```jsx
<Select
  label="Category"
  name="category"
  value={content.category}
  onChange={(value, name) => updateContent(name, value)}
  options={[
    { value: 'service', label: 'Service' },
    { value: 'page', label: 'Page' },
    { value: 'post', label: 'Blog Post' }
  ]}
  placeholder="Select a category"
  required={true}
/>
```

## Features

- **Loading States**: LoadingSpinner provides visual feedback during async operations with overlay mode
- **Confirmation Dialogs**: ConfirmDialog ensures user intent for destructive actions
- **Consistent Styling**: All components use the same SCSS module for uniform appearance
- **Validation Display**: Built-in error message display with ARIA attributes
- **Required Indicators**: Visual asterisk for required fields
- **Character Counting**: Automatic character counter for fields with maxLength
- **Accessibility**: Proper ARIA labels, roles, and error associations
- **Responsive**: Mobile-friendly with appropriate font sizes
- **Disabled State**: Visual feedback for disabled fields
- **Focus States**: Clear focus indicators with brand colors

## Styling

Components use SCSS modules with the King & Carter brand colors:
- Primary: #191919 (black)
- Accent: #D4AF37 (gold)
- Error: #e74c3c (red)

The styling is consistent with the existing admin panel design.

## Validation

These components handle display only. Validation logic should be implemented in the parent component:

```jsx
const [errors, setErrors] = useState({});

const validateForm = () => {
  const newErrors = {};
  
  if (!formData.title) {
    newErrors.title = 'Title is required';
  }
  
  if (formData.description && formData.description.length > 160) {
    newErrors.description = 'Description must be 160 characters or less';
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

## Requirements Satisfied

- **Requirement 1.5**: Loading states during asynchronous operations
- **Requirement 6.7**: Confirmation before permanent removal of media
- **Requirement 7.3**: Form fields for content management interface
- **Requirement 7.7**: Delete function with confirmation for content entities
- **Requirement 8.1**: Form fields for global settings management
