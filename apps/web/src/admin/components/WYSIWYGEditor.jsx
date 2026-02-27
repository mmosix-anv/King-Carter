import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import { useEffect, useState } from 'react';
import styles from './WYSIWYGEditor.module.scss';

/**
 * WYSIWYGEditor Component
 * 
 * A rich text editor component using TipTap that provides visual formatting controls.
 * Supports Bold, Italic, Underline, Headings, Lists, Links, Images, Undo/Redo, and Source Code View.
 * 
 * @param {Object} props
 * @param {string} props.value - The HTML content to display in the editor
 * @param {Function} props.onChange - Callback function called when content changes
 * @param {string} props.placeholder - Placeholder text when editor is empty
 * @param {string} props.label - Label for the editor field
 * @param {Function} props.onImageInsert - Optional callback to open media library for image selection
 */
const WYSIWYGEditor = ({ value = '', onChange, placeholder = 'Start typing...', label, onImageInsert }) => {
  const [showSourceCode, setShowSourceCode] = useState(false);
  const [sourceCode, setSourceCode] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        // Enable history for undo/redo
        history: {
          depth: 100,
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Underline,
      Image.configure({
        inline: true,
        allowBase64: false,
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
      if (showSourceCode) {
        setSourceCode(html);
      }
    },
    editorProps: {
      attributes: {
        class: styles.editorContent,
      },
      // Paste sanitization - clean up pasted content
      transformPastedHTML(html) {
        // Remove potentially dangerous tags and attributes
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        // Remove script tags
        const scripts = tempDiv.querySelectorAll('script');
        scripts.forEach(script => script.remove());
        
        // Remove event handlers
        const allElements = tempDiv.querySelectorAll('*');
        allElements.forEach(el => {
          // Remove all on* attributes (onclick, onload, etc.)
          Array.from(el.attributes).forEach(attr => {
            if (attr.name.startsWith('on')) {
              el.removeAttribute(attr.name);
            }
          });
          
          // Remove style attributes that could contain javascript
          const style = el.getAttribute('style');
          if (style && (style.includes('javascript:') || style.includes('expression('))) {
            el.removeAttribute('style');
          }
        });
        
        return tempDiv.innerHTML;
      },
    },
  });

  // Update editor content when value prop changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
      if (showSourceCode) {
        setSourceCode(value);
      }
    }
  }, [value, editor, showSourceCode]);

  // Initialize source code when toggling to source view
  useEffect(() => {
    if (showSourceCode && editor) {
      setSourceCode(editor.getHTML());
    }
  }, [showSourceCode, editor]);

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const insertImage = () => {
    // If onImageInsert callback is provided, use it (for media library integration)
    if (onImageInsert) {
      onImageInsert((imageUrl) => {
        if (imageUrl) {
          editor.chain().focus().setImage({ src: imageUrl }).run();
        }
      });
    } else {
      // Fallback to prompt
      const url = window.prompt('Enter image URL:');
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    }
  };

  const toggleSourceCode = () => {
    if (showSourceCode) {
      // Switching back to visual mode - update editor with source code
      editor.commands.setContent(sourceCode);
      onChange?.(sourceCode);
    }
    setShowSourceCode(!showSourceCode);
  };

  const handleSourceCodeChange = (e) => {
    const newCode = e.target.value;
    setSourceCode(newCode);
  };

  return (
    <div className={styles.wysiwygEditor}>
      {label && <label className={styles.label}>{label}</label>}
      
      <div className={styles.toolbar}>
        {/* Undo/Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
          className={styles.toolbarButton}
        >
          ↶ Undo
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
          className={styles.toolbarButton}
        >
          ↷ Redo
        </button>

        <div className={styles.separator} />

        {/* Text Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? styles.active : ''}
          title="Bold"
        >
          <strong>B</strong>
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? styles.active : ''}
          title="Italic"
        >
          <em>I</em>
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive('underline') ? styles.active : ''}
          title="Underline"
        >
          <u>U</u>
        </button>

        <div className={styles.separator} />

        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? styles.active : ''}
          title="Heading 1"
        >
          H1
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? styles.active : ''}
          title="Heading 2"
        >
          H2
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? styles.active : ''}
          title="Heading 3"
        >
          H3
        </button>

        <div className={styles.separator} />

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? styles.active : ''}
          title="Bullet List"
        >
          • List
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? styles.active : ''}
          title="Numbered List"
        >
          1. List
        </button>

        <div className={styles.separator} />

        {/* Link */}
        <button
          type="button"
          onClick={setLink}
          className={editor.isActive('link') ? styles.active : ''}
          title="Insert Link"
        >
          🔗 Link
        </button>

        {/* Image */}
        <button
          type="button"
          onClick={insertImage}
          className={editor.isActive('image') ? styles.active : ''}
          title="Insert Image"
        >
          🖼️ Image
        </button>

        <div className={styles.separator} />

        {/* Source Code Toggle */}
        <button
          type="button"
          onClick={toggleSourceCode}
          className={showSourceCode ? styles.active : ''}
          title="Toggle Source Code View"
        >
          &lt;/&gt; Source
        </button>
      </div>

      {showSourceCode ? (
        <textarea
          className={styles.sourceCodeEditor}
          value={sourceCode}
          onChange={handleSourceCodeChange}
          spellCheck="false"
        />
      ) : (
        <EditorContent editor={editor} className={styles.editor} />
      )}
    </div>
  );
};

export default WYSIWYGEditor;
