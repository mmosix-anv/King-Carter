import { useState } from 'react';
import MediaLibrary from './MediaLibrary';

/**
 * MediaLibrary Component Examples
 * 
 * This file demonstrates various usage patterns for the MediaLibrary component.
 */

// Example 1: Manage Mode (Full Media Management)
export function ManageModeExample() {
  const [token] = useState('your-jwt-token-here'); // In real app, get from auth context

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <h1 style={{ padding: '1rem' }}>Media Library - Manage Mode</h1>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <MediaLibrary
          mode="manage"
          token={token}
        />
      </div>
    </div>
  );
}

// Example 2: Select Mode - Single Image Selection
export function SingleSelectExample() {
  const [showLibrary, setShowLibrary] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [token] = useState('your-jwt-token-here');

  const handleSelect = (imageUrl) => {
    console.log('Selected image:', imageUrl);
    setSelectedImage(imageUrl);
    setShowLibrary(false);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Single Image Selection</h2>
      
      <button
        onClick={() => setShowLibrary(true)}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: '600'
        }}
      >
        Choose Image from Library
      </button>

      {selectedImage && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Selected Image:</h3>
          <img
            src={selectedImage}
            alt="Selected"
            style={{
              maxWidth: '400px',
              border: '2px solid #dee2e6',
              borderRadius: '8px'
            }}
          />
          <p style={{ marginTop: '0.5rem', color: '#6c757d' }}>
            {selectedImage}
          </p>
        </div>
      )}

      {showLibrary && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <div
            style={{
              width: '90%',
              height: '90%',
              backgroundColor: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
            }}
          >
            <MediaLibrary
              mode="select"
              multiSelect={false}
              onSelect={handleSelect}
              onClose={() => setShowLibrary(false)}
              token={token}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Example 3: Select Mode - Multiple Image Selection
export function MultiSelectExample() {
  const [showLibrary, setShowLibrary] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [token] = useState('your-jwt-token-here');

  const handleSelect = (imageUrls) => {
    console.log('Selected images:', imageUrls);
    setGalleryImages([...galleryImages, ...imageUrls]);
    setShowLibrary(false);
  };

  const handleRemoveImage = (index) => {
    const newImages = [...galleryImages];
    newImages.splice(index, 1);
    setGalleryImages(newImages);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Multiple Image Selection (Gallery)</h2>
      
      <button
        onClick={() => setShowLibrary(true)}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: '600'
        }}
      >
        Add Images to Gallery
      </button>

      {galleryImages.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Gallery Images ({galleryImages.length}):</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: '1rem',
              marginTop: '1rem'
            }}
          >
            {galleryImages.map((url, index) => (
              <div
                key={index}
                style={{
                  position: 'relative',
                  border: '2px solid #dee2e6',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}
              >
                <img
                  src={url}
                  alt={`Gallery ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover'
                  }}
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    width: '28px',
                    height: '28px',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #dee2e6',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                  title="Remove image"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showLibrary && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <div
            style={{
              width: '90%',
              height: '90%',
              backgroundColor: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
            }}
          >
            <MediaLibrary
              mode="select"
              multiSelect={true}
              onSelect={handleSelect}
              onClose={() => setShowLibrary(false)}
              token={token}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Example 4: Integration with WYSIWYG Editor
export function WYSIWYGIntegrationExample() {
  const [showLibrary, setShowLibrary] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const [token] = useState('your-jwt-token-here');

  const handleSelect = (imageUrl) => {
    // Insert image into editor content
    const imageMarkup = `<img src="${imageUrl}" alt="Inserted image" />`;
    setEditorContent(editorContent + imageMarkup);
    setShowLibrary(false);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>WYSIWYG Editor Integration</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => setShowLibrary(true)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '600'
          }}
        >
          📷 Insert Image from Library
        </button>
      </div>

      <div
        style={{
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          padding: '1rem',
          minHeight: '300px',
          backgroundColor: 'white'
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: editorContent }} />
      </div>

      {showLibrary && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <div
            style={{
              width: '90%',
              height: '90%',
              backgroundColor: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
            }}
          >
            <MediaLibrary
              mode="select"
              multiSelect={false}
              onSelect={handleSelect}
              onClose={() => setShowLibrary(false)}
              token={token}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Example 5: Standalone Media Management Page
export function MediaManagementPageExample() {
  const [token] = useState('your-jwt-token-here');

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Page Header */}
      <header
        style={{
          padding: '1rem 2rem',
          backgroundColor: '#343a40',
          color: 'white',
          borderBottom: '1px solid #495057'
        }}
      >
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Admin Panel - Media Library</h1>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, overflow: 'hidden' }}>
        <MediaLibrary
          mode="manage"
          token={token}
        />
      </main>
    </div>
  );
}

// Default export with all examples
export default function MediaLibraryExamples() {
  const [activeExample, setActiveExample] = useState('manage');

  const examples = {
    manage: { component: ManageModeExample, label: 'Manage Mode' },
    single: { component: SingleSelectExample, label: 'Single Select' },
    multi: { component: MultiSelectExample, label: 'Multi Select' },
    wysiwyg: { component: WYSIWYGIntegrationExample, label: 'WYSIWYG Integration' },
    page: { component: MediaManagementPageExample, label: 'Full Page' }
  };

  const ActiveComponent = examples[activeExample].component;

  return (
    <div>
      <div
        style={{
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #dee2e6',
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap'
        }}
      >
        {Object.entries(examples).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => setActiveExample(key)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: activeExample === key ? '#007bff' : 'white',
              color: activeExample === key ? 'white' : '#495057',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <ActiveComponent />
    </div>
  );
}
