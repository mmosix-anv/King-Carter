# WYSIWYGEditor Component

A rich text editor component built with TipTap that provides visual formatting controls and advanced editing features.

## Features

### Core Formatting
- **Bold, Italic, Underline**: Basic text formatting
- **Headings**: H1, H2, H3 support
- **Lists**: Bullet lists and numbered lists
- **Links**: Insert and edit hyperlinks

### Advanced Features (Task 7.2)

#### 1. Undo/Redo Functionality
- **Undo** (↶): Revert the last change
- **Redo** (↷): Reapply a reverted change
- History depth: 100 operations
- Buttons are automatically disabled when no operations are available

#### 2. Source Code View Toggle
- **Toggle Button** (`</>`): Switch between visual and HTML source code view
- Edit HTML directly in source code mode
- Changes sync back to visual mode when toggling
- Syntax highlighting in dark theme for better readability

#### 3. Paste Sanitization
- Automatically removes dangerous content from pasted HTML:
  - `<script>` tags are stripped
  - Event handlers (`onclick`, `onload`, etc.) are removed
  - Malicious CSS (javascript:, expression()) is cleaned
- Preserves safe formatting and structure
- Works transparently - no user action required

#### 4. Image Insertion
- **Insert Image Button** (🖼️): Add images to content
- Two modes of operation:
  1. **With Media Library**: Pass `onImageInsert` callback to integrate with media library
  2. **Direct URL**: Prompts for image URL if no callback provided
- Images are responsive and styled with `.editor-image` class
- Supports inline image placement

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `value` | string | No | `''` | HTML content to display in the editor |
| `onChange` | function | No | - | Callback called when content changes, receives HTML string |
| `placeholder` | string | No | `'Start typing...'` | Placeholder text when editor is empty |
| `label` | string | No | - | Label displayed above the editor |
| `onImageInsert` | function | No | - | Callback for image insertion, receives a callback function to call with selected image URL |

## Usage

### Basic Usage

```jsx
import WYSIWYGEditor from './WYSIWYGEditor';

function MyComponent() {
  const [content, setContent] = useState('');

  return (
    <WYSIWYGEditor
      label="Description"
      value={content}
      onChange={setContent}
      placeholder="Enter your content..."
    />
  );
}
```

### With Media Library Integration

```jsx
function MyComponent() {
  const [content, setContent] = useState('');
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [imageCallback, setImageCallback] = useState(null);

  const handleImageInsert = (callback) => {
    setImageCallback(() => callback);
    setShowMediaLibrary(true);
  };

  const handleImageSelect = (imageUrl) => {
    if (imageCallback) {
      imageCallback(imageUrl);
    }
    setShowMediaLibrary(false);
  };

  return (
    <>
      <WYSIWYGEditor
        value={content}
        onChange={setContent}
        onImageInsert={handleImageInsert}
      />
      
      {showMediaLibrary && (
        <MediaLibrary
          onSelect={handleImageSelect}
          onClose={() => setShowMediaLibrary(false)}
        />
      )}
    </>
  );
}
```

## Keyboard Shortcuts

- **Ctrl/Cmd + Z**: Undo
- **Ctrl/Cmd + Shift + Z**: Redo
- **Ctrl/Cmd + B**: Bold
- **Ctrl/Cmd + I**: Italic
- **Ctrl/Cmd + U**: Underline

## Styling

The component uses SCSS modules for styling. Key classes:

- `.wysiwygEditor`: Main container
- `.toolbar`: Toolbar container with buttons
- `.editor`: Visual editor container
- `.sourceCodeEditor`: Source code textarea
- `.active`: Active state for toolbar buttons

### Customization

To customize the editor appearance, override the SCSS module classes or modify `WYSIWYGEditor.module.scss`.

## Security

### Paste Sanitization
The editor automatically sanitizes pasted content to prevent XSS attacks:
- Removes `<script>` tags
- Strips event handler attributes
- Cleans malicious CSS

This happens transparently through the `transformPastedHTML` editor prop.

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support with touch-friendly interface

## Dependencies

- `@tiptap/react`: Core editor framework
- `@tiptap/starter-kit`: Basic extensions (headings, lists, etc.)
- `@tiptap/extension-link`: Link support
- `@tiptap/extension-underline`: Underline formatting
- `@tiptap/extension-image`: Image insertion support

## Testing

Tests are located in `__tests__/WYSIWYGEditor.test.jsx` and cover:
- Basic rendering and toolbar buttons
- Content changes and onChange callback
- Undo/redo functionality
- Source code view toggle
- Image insertion with and without media library
- Paste sanitization

Run tests with:
```bash
npm test -- WYSIWYGEditor.test.jsx
```

## Requirements Satisfied

This component satisfies the following requirements from the Enhanced Admin Panel spec:

- **3.1**: Formatting controls for bold, italic, underline, headings, lists, and links ✓
- **3.2**: Visual formatting display ✓
- **3.3**: Semantic HTML generation ✓
- **3.4**: Undo and redo operations ✓
- **3.5**: Paste sanitization for external content ✓
- **3.6**: Source code view for advanced users ✓
- **3.7**: Image insertion integration with media library ✓

## Future Enhancements

Potential improvements for future iterations:
- Table support
- Code block syntax highlighting
- Emoji picker
- Markdown import/export
- Collaborative editing
- Custom color picker
- Font size controls
