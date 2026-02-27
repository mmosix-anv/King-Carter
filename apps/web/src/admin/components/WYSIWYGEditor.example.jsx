/**
 * WYSIWYGEditor Usage Examples
 * 
 * This file demonstrates how to use the enhanced WYSIWYG editor with all its features.
 */

import { useState } from 'react';
import WYSIWYGEditor from './WYSIWYGEditor';

/**
 * Example 1: Basic Usage
 * Simple editor with onChange handler
 */
export const BasicExample = () => {
  const [content, setContent] = useState('<p>Start typing...</p>');

  return (
    <WYSIWYGEditor
      label="Description"
      value={content}
      onChange={setContent}
      placeholder="Enter your content here..."
    />
  );
};

/**
 * Example 2: With Media Library Integration
 * Editor with image insertion capability using media library
 */
export const WithMediaLibraryExample = () => {
  const [content, setContent] = useState('');
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [imageCallback, setImageCallback] = useState(null);

  const handleImageInsert = (callback) => {
    // Store the callback to be called when image is selected
    setImageCallback(() => callback);
    setShowMediaLibrary(true);
  };

  const handleImageSelect = (imageUrl) => {
    // Call the callback with selected image URL
    if (imageCallback) {
      imageCallback(imageUrl);
    }
    setShowMediaLibrary(false);
    setImageCallback(null);
  };

  return (
    <div>
      <WYSIWYGEditor
        label="Content"
        value={content}
        onChange={setContent}
        onImageInsert={handleImageInsert}
      />
      
      {showMediaLibrary && (
        <div className="media-library-modal">
          {/* Media library component would go here */}
          <button onClick={() => handleImageSelect('https://example.com/image.jpg')}>
            Select Image
          </button>
          <button onClick={() => setShowMediaLibrary(false)}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * Example 3: Form Integration
 * Editor integrated into a form with validation
 */
export const FormIntegrationExample = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    highlights: '',
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate
    const newErrors = {};
    if (!formData.description || formData.description === '<p></p>') {
      newErrors.description = 'Description is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Submit form
    console.log('Form submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Title"
      />
      
      <WYSIWYGEditor
        label="Description"
        value={formData.description}
        onChange={(html) => setFormData({ ...formData, description: html })}
      />
      {errors.description && <span className="error">{errors.description}</span>}
      
      <WYSIWYGEditor
        label="Highlights"
        value={formData.highlights}
        onChange={(html) => setFormData({ ...formData, highlights: html })}
      />
      
      <button type="submit">Save</button>
    </form>
  );
};

/**
 * Features Demonstrated:
 * 
 * 1. Undo/Redo: Click the ↶ Undo and ↷ Redo buttons in the toolbar
 * 2. Source Code View: Click the </> Source button to toggle between visual and HTML view
 * 3. Paste Sanitization: Paste content from external sources - scripts and event handlers are automatically removed
 * 4. Image Insertion: Click the 🖼️ Image button to insert images
 *    - Without onImageInsert: Prompts for image URL
 *    - With onImageInsert: Opens media library for selection
 * 
 * Toolbar Features:
 * - Text Formatting: Bold, Italic, Underline
 * - Headings: H1, H2, H3
 * - Lists: Bullet List, Numbered List
 * - Links: Insert/edit hyperlinks
 * - Images: Insert images from URL or media library
 * - History: Undo/Redo operations
 * - Source: Toggle HTML source code view
 */
