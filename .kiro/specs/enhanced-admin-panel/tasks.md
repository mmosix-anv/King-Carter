# Implementation Plan: Enhanced Admin Panel with Modern UI and Content Management

## Overview

This implementation plan breaks down the Enhanced Admin Panel feature into discrete coding tasks. The system will be built incrementally, starting with backend infrastructure, then core frontend components, followed by content management features, and finally media and settings management. Each task builds on previous work to ensure a functional system at each checkpoint.

## Tasks

- [ ] 1. Set up backend authentication and middleware infrastructure
  - [x] 1.1 Create JWT authentication middleware for protected routes
    - Implement `verifyToken` middleware in `apps/api/middleware/auth.js`
    - Extract and verify JWT from Authorization header
    - Attach userId to request object for downstream use
    - Return 401 for invalid/expired tokens
    - _Requirements: 2.2, 2.3, 2.6_
  
  - [x] 1.2 Create login endpoint with JWT token generation
    - Implement `POST /api/auth/login` route in `apps/api/routes/auth.js`
    - Validate username and password against users table
    - Generate JWT token with 24-hour expiration
    - Return token and user info in response
    - _Requirements: 2.2, 2.3_
  
  - [x] 1.3 Create error handling middleware
    - Implement global error handler in `apps/api/middleware/errorHandler.js`
    - Log errors with appropriate detail level
    - Return sanitized error responses with proper status codes
    - Handle validation errors, authentication errors, and server errors
    - _Requirements: 1.6_

- [ ] 2. Set up image upload and processing infrastructure
  - [x] 2.1 Configure Multer middleware for file uploads
    - Create upload middleware in `apps/api/middleware/upload.js`
    - Configure memory storage for Supabase upload
    - Add file type validation for images only
    - Set file size limit to 10MB
    - _Requirements: 4.1, 4.2, 12.1, 12.2, 12.3_
  
  - [x] 2.2 Implement image processing service with Sharp
    - Create `ImageProcessor` class in `apps/api/services/imageProcessor.js`
    - Implement `generateThumbnail()` method (300x300, maintain aspect ratio)
    - Implement `generateMedium()` method (800w, maintain aspect ratio)
    - Implement `processUpload()` to generate all variants and return URLs
    - Implement `deleteImage()` to remove all variants
    - Create `SupabaseStorage` service in `apps/api/services/supabaseStorage.js` for cloud storage
    - Implement `processBuffer()` method for buffer-based processing
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_
  
  - [x] 2.3 Create media database repository
    - Create `MediaRepository` class in `apps/api/repositories/mediaRepository.js`
    - Implement `create()` method to insert media records
    - Implement `findAll()` with pagination and search support
    - Implement `findById()` and `delete()` methods
    - _Requirements: 6.1, 6.2, 6.3, 6.6_
  
  - [x] 2.4 Create single image upload endpoint
    - Implement `POST /api/media/upload` route in `apps/api/routes/media.js`
    - Use Multer middleware and verifyToken protection
    - Process and upload image to Supabase Storage
    - Store Supabase Storage URLs in database
    - Return URLs for all image variants
    - _Requirements: 4.5, 4.6, 12.5, 12.6, 12.7_
  
  - [x] 2.5 Create multiple image upload endpoint
    - Implement `POST /api/media/upload-multiple` route
    - Accept array of files from Multer
    - Process and upload each image to Supabase Storage
    - Return array of media records with URLs
    - _Requirements: 5.1, 5.6, 5.8_

- [ ] 3. Create media library management endpoints
  - [x] 3.1 Implement media list endpoint with pagination
    - Implement `GET /api/media` route
    - Support query parameters for page, limit, and search
    - Return paginated media records with metadata
    - _Requirements: 6.1, 6.2, 6.3, 6.5_
  
  - [x] 3.2 Implement media delete endpoint
    - Implement `DELETE /api/media/:id` route with verifyToken protection
    - Delete media record from database
    - Delete all image file variants from Supabase Storage
    - _Requirements: 6.6, 6.7_

- [ ] 4. Checkpoint - Test backend infrastructure
  - Run the API server and verify all endpoints respond correctly
  - Test authentication flow with valid and invalid credentials
  - Test image upload with various file types and sizes
  - Ensure all tests pass, ask the user if questions arise

- [ ] 5. Set up frontend admin panel structure
  - [x] 5.1 Create admin panel routing and layout structure
    - Set up React Router in `apps/web/src/admin/App.jsx`
    - Define routes: /admin/login, /admin/dashboard, /admin/content, /admin/media, /admin/settings
    - Create `AdminLayout` component with Sidebar, Header, and MainContent
    - _Requirements: 1.2, 1.3_
  
  - [x] 5.2 Create authentication context and protected routes
    - Create `AuthContext` in `apps/web/src/admin/context/AuthContext.jsx`
    - Implement login, logout, and token management functions
    - Store JWT in localStorage
    - Create `ProtectedRoute` component that checks authentication
    - Redirect to login if token is missing or expired
    - _Requirements: 2.1, 2.3, 2.4, 2.5_
  
  - [x] 5.3 Create login page component
    - Implement `LoginPage` component in `apps/web/src/admin/pages/LoginPage.jsx`
    - Create form with username and password fields
    - Handle form submission and call login API
    - Display error messages for failed authentication
    - Redirect to dashboard on successful login
    - _Requirements: 2.1, 2.2_
  
  - [x] 5.4 Create sidebar navigation component
    - Implement `Sidebar` component in `apps/web/src/admin/components/Sidebar.jsx`
    - Display navigation links for Dashboard, Content, Media, Settings
    - Highlight active route
    - Make responsive with collapse on mobile
    - _Requirements: 1.2, 1.3_
  
  - [x] 5.5 Create header and notification components
    - Implement `Header` component with user info and logout button
    - Create `NotificationContainer` for toast notifications
    - Implement success and error notification display
    - Auto-dismiss notifications after 5 seconds
    - _Requirements: 1.5, 1.6_

- [ ] 6. Implement shared UI components
  - [x] 6.1 Create form field components
    - Create `FormField` component for text inputs
    - Create `TextArea` component for multi-line text
    - Create `Select` component for dropdowns
    - Add validation display and error messages
    - _Requirements: 7.3, 8.1_
  
  - [x] 6.2 Create loading and confirmation components
    - Create `LoadingSpinner` component with overlay mode
    - Create `ConfirmDialog` modal for destructive actions
    - _Requirements: 1.5, 6.7, 7.7_
  
  - [x] 6.3 Apply consistent styling with SCSS modules
    - Create base styles in `apps/web/src/admin/styles/base.scss`
    - Define color scheme, typography, and spacing variables
    - Create component-scoped SCSS modules
    - Ensure responsive layout for desktop, tablet, and mobile
    - _Requirements: 1.1, 1.4_

- [ ] 7. Implement WYSIWYG editor integration
  - [x] 7.1 Set up TipTap editor component
    - Install TipTap dependencies
    - Create `WYSIWYGEditor` component in `apps/web/src/admin/components/WYSIWYGEditor.jsx`
    - Configure toolbar with Bold, Italic, Underline, Headings, Lists, Links
    - Implement value and onChange props for controlled component
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [x] 7.2 Add advanced editor features
    - Implement undo/redo functionality
    - Add source code view toggle
    - Implement paste sanitization for external content
    - Add image insertion capability (integrate with media library)
    - _Requirements: 3.4, 3.5, 3.6, 3.7_

- [ ] 8. Implement image upload components
  - [x] 8.1 Create single image upload component
    - Create `ImageUpload` component in `apps/web/src/admin/components/ImageUpload.jsx`
    - Implement file input with drag-and-drop using React Dropzone
    - Add file type and size validation
    - Display image preview after selection
    - Show upload progress indicator
    - Provide remove/replace controls
    - Call single upload API endpoint
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_
  
  - [x] 8.2 Create gallery upload component
    - Create `GalleryUpload` component in `apps/web/src/admin/components/GalleryUpload.jsx`
    - Support multiple file selection
    - Display upload queue with thumbnail previews
    - Implement drag-to-reorder functionality
    - Allow removing individual images from queue
    - Upload images in batches with progress tracking
    - Call multiple upload API endpoint
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_
  
  - [x] 8.3 Create media library browser component
    - Create `MediaLibrary` component in `apps/web/src/admin/components/MediaLibrary.jsx`
    - Display images in grid layout with thumbnails
    - Implement pagination (50 images per page)
    - Add search functionality by filename
    - Support selection mode for inserting into content
    - Display image metadata (filename, date, size)
    - Implement delete functionality with confirmation
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

- [ ] 9. Checkpoint - Test media management
  - Test single image upload with preview
  - Test multiple image upload with reordering
  - Test media library browsing and search
  - Verify image variants are generated correctly
  - Ensure all tests pass, ask the user if questions arise

- [ ] 10. Create backend endpoints for services content management
  - [x] 10.1 Extend services database schema
    - Add migration to extend services table with new fields
    - Add status, created_by, updated_by, created_at, updated_at columns
    - Ensure backward compatibility with existing data
    - _Requirements: 13.1, 15.1, 15.2, 15.3_
  
  - [x] 10.2 Create audit trail repository
    - Create `AuditRepository` class in `apps/api/repositories/auditRepository.js`
    - Implement `recordChange()` method to log entity changes
    - Implement `getHistory()` method to retrieve audit trail
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_
  
  - [x] 10.3 Implement services CRUD endpoints
    - Implement `GET /api/services` with status filtering
    - Implement `GET /api/services/:id` for single service
    - Implement `POST /api/services` for create/update with verifyToken
    - Implement `DELETE /api/services/:id` with verifyToken
    - Record audit trail for all changes
    - _Requirements: 7.1, 7.3, 7.7, 7.8, 13.5, 13.6_

- [ ] 11. Implement content management UI
  - [x] 11.1 Create content list page
    - Create `ContentList` component in `apps/web/src/admin/pages/ContentList.jsx`
    - Display table with columns: Title, Status, Last Modified, Actions
    - Add filter dropdown for status (draft/published)
    - Add search functionality
    - Add "Create New" button
    - Implement edit and delete actions
    - _Requirements: 7.1, 7.2, 13.5, 13.6, 15.4_
  
  - [x] 11.2 Create service content editor page
    - Create `ServiceEditor` component in `apps/web/src/admin/pages/ServiceEditor.jsx`
    - Add form fields for ID, hero title, hero tagline
    - Integrate ImageUpload for hero image and featured image
    - Integrate WYSIWYGEditor for description and highlights
    - Integrate GalleryUpload for service images
    - Add fields for CTA text and button label
    - Add status selector (draft/published)
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_
  
  - [x] 11.3 Implement save and publish functionality
    - Add "Save as Draft" button that sets status to draft
    - Add "Publish" button that sets status to published
    - Serialize WYSIWYG content to HTML/JSON format
    - Call services API endpoint with form data
    - Display success/error notifications
    - Redirect to content list on success
    - _Requirements: 7.6, 7.8, 10.7, 10.8, 13.2, 13.3, 13.4_
  
  - [x] 11.4 Implement content delete with confirmation
    - Add delete button in content list
    - Show confirmation dialog before deletion
    - Call delete API endpoint
    - Update content list after successful deletion
    - _Requirements: 7.7_

- [ ] 12. Implement global settings management
  - [x] 12.1 Create settings backend endpoints
    - Implement `GET /api/global-settings` route
    - Implement `POST /api/global-settings` route with verifyToken
    - Store settings as key-value pairs with category grouping
    - Support general, contact, and SEO categories
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [x] 12.2 Create settings form UI
    - Create `SettingsForm` component in `apps/web/src/admin/pages/SettingsForm.jsx`
    - Implement tabs for General, Contact, and SEO sections
    - Add form fields for site title, contact email, phone number
    - Load current settings on page mount
    - _Requirements: 8.1, 8.2, 8.5_
  
  - [x] 12.3 Implement SEO settings section
    - Add fields for meta title (max 60 chars) and meta description (max 160 chars)
    - Add fields for Open Graph title, description, and image
    - Add fields for Twitter Card meta tags
    - Add fields for Google Analytics ID and Search Console code
    - Add textarea for custom meta tags
    - Implement character count validation
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9_
  
  - [x] 12.4 Implement settings save and reset
    - Add "Save Settings" button that calls API endpoint
    - Add "Reset" button to restore default values
    - Display success/error notifications
    - _Requirements: 8.3, 8.4, 8.6_

- [ ] 13. Implement navigation management
  - [x] 13.1 Create navigation backend endpoints
    - Implement `GET /api/nav-links` route
    - Implement `POST /api/nav-links` route with verifyToken
    - Store navigation structure as JSON in database
    - Support left links, right links, and CTA buttons
    - _Requirements: 11.7_
  
  - [x] 13.2 Create navigation manager UI
    - Create `NavigationManager` component in `apps/web/src/admin/pages/NavigationManager.jsx`
    - Create sections for left navigation and right navigation
    - Display list of navigation links with label and URL
    - Add "Add Link" button for each section
    - Implement drag-to-reorder functionality
    - Add checkbox for "Open in new tab" option
    - Add remove button for each link
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_
  
  - [x] 13.3 Implement CTA button configuration
    - Add section for primary and secondary CTA buttons
    - Add fields for label and URL for each CTA
    - Add "Save Navigation" button
    - Call navigation API endpoint with complete structure
    - _Requirements: 11.6, 11.7_

- [ ] 14. Implement dashboard overview page
  - [x] 14.1 Create dashboard component
    - Create `Dashboard` component in `apps/web/src/admin/pages/Dashboard.jsx`
    - Display summary statistics (total content, media count, draft count)
    - Show recent content changes
    - Add quick action buttons for common tasks
    - _Requirements: 1.2_

- [ ] 15. Final integration and polish
  - [x] 15.1 Ensure frontend displays only published content
    - Update public-facing pages to filter by status="published"
    - Verify draft content is not visible on frontend
    - _Requirements: 13.7_
  
  - [x] 15.2 Add audit trail display in content editor
    - Display creation date and user in content detail view
    - Display last modified date and user in content list
    - _Requirements: 15.4, 15.5_
  
  - [x] 15.3 Implement comprehensive error handling
    - Ensure all API errors display user-friendly messages
    - Add validation error display for all forms
    - Test error scenarios (network failures, validation errors, auth failures)
    - _Requirements: 1.6, 4.7_
  
  - [x] 15.4 Optimize responsive layout
    - Test all pages on mobile, tablet, and desktop viewports
    - Ensure sidebar collapses appropriately on mobile
    - Verify image uploads work on touch devices
    - _Requirements: 1.1_

- [ ] 16. Final checkpoint - Complete system testing
  - Test complete content creation workflow from login to publish
  - Test media library with large number of images
  - Test all settings save and load correctly
  - Test navigation management and verify changes appear on frontend
  - Verify audit trail records all changes
  - Ensure all tests pass, ask the user if questions arise

## Notes

- All backend routes requiring authentication use the `verifyToken` middleware
- Images are uploaded to Supabase Storage with three variants: original, thumbnail (300x300), and medium (800w)
- Files are stored in Supabase Storage (cloud) instead of local filesystem
- Multer uses memory storage to keep files in memory before uploading to Supabase
- WYSIWYG editor content is serialized to HTML for storage
- Audit trail automatically records user ID and timestamps for all content changes
- Frontend uses React Router for SPA navigation without full page reloads
- All forms include validation and display appropriate error messages
- Media library supports pagination to handle large numbers of images efficiently
