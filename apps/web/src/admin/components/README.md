# Admin Components

This directory contains reusable components for the admin panel.

## WYSIWYGEditor

A rich text editor component built with TipTap that provides visual formatting controls for content editing.

### Features

- **Text Formatting**: Bold, Italic, Underline
- **Headings**: H1, H2, H3 (with support for H4-H6)
- **Lists**: Bullet lists and numbered lists
- **Links**: Insert and edit hyperlinks
- **Visual Editing**: WYSIWYG interface with real-time preview
- **Controlled Component**: Works with React state management

### Usage

```jsx
import WYSIWYGEditor from './components/WYSIWYGEditor';

function MyForm() {
  const [content, setContent] = useState('<p>Initial content</p>');

  return (
    <WYSIWYGEditor
      label="Description"
      value={content}
      onChange={setContent}
      placeholder="Start typing..."
    />
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `''` | HTML content to display in the editor |
| `onChange` | `function` | - | Callback function called when content changes, receives HTML string |
| `label` | `string` | - | Label text displayed above the editor |
| `placeholder` | `string` | `'Start typing...'` | Placeholder text when editor is empty |

### Requirements Satisfied

- **Requirement 3.1**: Provides formatting controls for bold, italic, underline, headings, lists, and links
- **Requirement 3.2**: Displays content with visual formatting as it will appear on the frontend
- **Requirement 3.3**: Generates semantic HTML markup when text is formatted

### Styling

The component uses SCSS modules for scoped styling. The editor includes:
- A toolbar with formatting buttons
- A content area with proper typography
- Responsive design for mobile and desktop
- Active state indicators for formatting buttons

### Technical Details

- Built with TipTap (ProseMirror-based editor)
- Uses StarterKit for basic functionality
- Includes Link and Underline extensions
- Generates clean, semantic HTML output
- Supports controlled component pattern with React state
