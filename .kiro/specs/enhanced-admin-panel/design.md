# Design Document: Enhanced Admin Panel with Modern UI and Content Management

## Overview

The Enhanced Admin Panel is a comprehensive content management system that replaces the existing basic admin interface with a modern, React-based single-page application. The system provides rich content editing capabilities through WYSIWYG editors, robust image management with gallery support, and comprehensive global settings configuration including SEO optimization.

### Key Design Goals

1. **Modern User Experience**: Responsive, intuitive interface built with React and SCSS modules
2. **Rich Content Editing**: WYSIWYG editor integration for visual content creation without manual HTML
3. **Comprehensive Media Management**: Single and multiple image uploads with preview, media library, and responsive image generation
4. **Secure Authentication**: JWT-based authentication with token expiration and protected routes
5. **Extensible Architecture**: Modular component design that supports future feature additions
6. **Backward Compatibility**: Maintains existing API patterns and database schema where possible

### Technology Stack

**Frontend:**
- React 18.2 with React Router for SPA navigation
- SCSS modules for component-scoped styling
- TipTap or Quill for WYSIWYG editing
- React Dropzone for file uploads
- Vite for build tooling

**Backend:**
- Express.js with existing route patterns
- Supabase (PostgreSQL) as primary database
- JWT for authentication
- Multer for multipart file uploads
- Sharp for image processing and optimization

## Architecture

### High-Level Architecture

The system follows a client-server architecture with clear separation between the admin panel (React SPA) and the backend API (Express):

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Client)                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         Enhanced Admin Panel (React SPA)               │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐            │ │
│  │  │  Auth    │  │ Content  │  │  Media   │            │ │
│  │  │  Module  │  │ Manager  │  │ Manager  │            │ │
│  │  └──────────┘  └──────────┘  └──────────┘            │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐            │ │
│  │  │ Settings │  │ WYSIWYG  │  │   UI     │            │ │
│  │  │ Manager  │  │ Editor   │  │Components│            │ │
│  │  └──────────┘  └──────────┘  └──────────┘            │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                    HTTPS/JSON + JWT
                            │
┌─────────────────────────────────────────────────────────────┐
│                   Backend API (Express)                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                   API Routes                           │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐            │ │
│  │  │   Auth   │  │ Services │  │  Media   │            │ │
│  │  │  Routes  │  │  Routes  │  │  Routes  │            │ │
│  │  └──────────┘  └──────────┘  └──────────┘            │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐            │ │
│  │  │ Settings │  │ NavLinks │  │  Upload  │            │ │
│  │  │  Routes  │  │  Routes  │  │ Processor│            │ │
│  │  └──────────┘  └──────────┘  └──────────┘            │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Middleware Layer                          │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐            │ │
│  │  │   JWT    │  │  Multer  │  │  Error   │            │ │
│  │  │  Verify  │  │  Upload  │  │ Handler  │            │ │
│  │  └──────────┘  └──────────┘  └──────────┘            │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │
┌─────────────────────────────────────────────────────────────┐
│              Supabase (PostgreSQL Database)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  users   │  │ services │  │  media   │  │ settings │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐                                │
│  │nav_links │  │  audit   │                                │
│  └──────────┘  └──────────┘                                │
└─────────────────────────────────────────────────────────────┘
```

### Application Flow

1. **Authentication Flow**:
   - User accesses admin panel → redirected to login if no valid JWT
   - User submits credentials → backend validates → returns JWT token
   - Token stored in localStorage → included in all subsequent API requests
   - Token expiration triggers automatic logout and redirect

2. **Content Management Flow**:
   - User navigates to content section → loads content list from API
   - User creates/edits content → WYSIWYG editor provides rich text interface
   - User uploads images → files sent to upload API → URLs returned
   - User saves content → serialized to JSON/HTML → stored in database
   - Audit trail automatically records user ID and timestamps

3. **Media Management Flow**:
   - User uploads image(s) → validation → Sharp processing → storage
   - System generates thumbnail (300x300) and medium (800w) variants
   - URLs for all variants returned to client
   - Media library displays all uploaded images with metadata
   - User can select from library to insert into content

### Routing Strategy

**Frontend Routes** (React Router):
- `/admin/login` - Login page
- `/admin/dashboard` - Dashboard overview
- `/admin/content` - Content list and management
- `/admin/content/:id` - Edit specific content
- `/admin/media` - Media library
- `/admin/settings` - Global settings
- `/admin/settings/seo` - SEO configuration

**Backend API Routes**:
- `POST /api/auth/login` - Authentication
- `GET /api/services` - List all services
- `GET /api/services/:id` - Get specific service
- `POST /api/services` - Create/update service (protected)
- `DELETE /api/services/:id` - Delete service (protected)
- `POST /api/media/upload` - Upload single image (protected)
- `POST /api/media/upload-multiple` - Upload multiple images (protected)
- `GET /api/media` - List media library (protected)
- `DELETE /api/media/:id` - Delete media (protected)
- `GET /api/global-settings` - Get all settings
- `POST /api/global-settings` - Update settings (protected)
- `GET /api/nav-links` - Get navigation
- `POST /api/nav-links` - Update navigation (protected)

## Components and Interfaces

### Frontend Components

#### 1. Authentication Components

**LoginPage Component**
```jsx
<LoginPage>
  - State: username, password, error, loading
  - Methods: handleLogin(), validateForm()
  - API: POST /api/auth/login
  - Redirects to dashboard on success
</LoginPage>
```

**ProtectedRoute Component**
```jsx
<ProtectedRoute>
  - Checks for valid JWT token
  - Redirects to login if unauthorized
  - Wraps all admin routes
</ProtectedRoute>
```

#### 2. Layout Components

**AdminLayout Component**
```jsx
<AdminLayout>
  <Sidebar navigation={sections} />
  <Header user={currentUser} onLogout={handleLogout} />
  <MainContent>
    {children}
  </MainContent>
  <NotificationContainer />
</AdminLayout>
```

**Sidebar Component**
- Navigation links for Dashboard, Content, Media, Settings
- Active state highlighting
- Responsive collapse on mobile

**Header Component**
- User info display
- Logout button
- Breadcrumb navigation

#### 3. Content Management Components

**ContentList Component**
```jsx
<ContentList>
  - Displays table/grid of content entities
  - Columns: Title, Status, Last Modified, Actions
  - Filter by status (draft/published)
  - Search functionality
  - Create new button
  - Edit/Delete actions per item
</ContentList>
```

**ContentEditor Component**
```jsx
<ContentEditor contentId={id}>
  <FormField label="ID" name="id" />
  <FormField label="Hero Title" name="heroTitle" />
  <FormField label="Hero Tagline" name="heroTagline" />
  <ImageUpload label="Hero Image" name="heroImage" />
  <WYSIWYGEditor label="Description" name="description" />
  <WYSIWYGEditor label="Highlights" name="highlights" />
  <ImageUpload label="Featured Image" name="featuredImage" />
  <GalleryUpload label="Gallery Images" name="images" />
  <FormField label="CTA Text" name="ctaText" />
  <FormField label="CTA Button" name="ctaButton" />
  <StatusSelector value={status} />
  <ButtonGroup>
    <Button onClick={saveDraft}>Save as Draft</Button>
    <Button onClick={publish}>Publish</Button>
  </ButtonGroup>
</ContentEditor>
```

**WYSIWYGEditor Component**
- Integration with TipTap or Quill
- Toolbar: Bold, Italic, Underline, Headings, Lists, Links, Images
- Source code view toggle
- Paste sanitization
- Undo/Redo support
- Props: value, onChange, placeholder

#### 4. Media Management Components

**ImageUpload Component**
```jsx
<ImageUpload 
  mode="single" 
  value={imageUrl}
  onChange={handleImageChange}
  maxSize={10485760}
>
  - File input with drag-and-drop
  - Image preview
  - Validation (type, size)
  - Upload progress indicator
  - Remove/Replace controls
  - Media library browser button
</ImageUpload>
```

**GalleryUpload Component**
```jsx
<GalleryUpload 
  value={imageUrls}
  onChange={handleGalleryChange}
>
  - Multiple file selection
  - Upload queue with thumbnails
  - Drag-to-reorder functionality
  - Individual remove buttons
  - Batch upload with progress
  - Media library multi-select
</GalleryUpload>
```

**MediaLibrary Component**
```jsx
<MediaLibrary 
  mode="select|manage"
  onSelect={handleSelect}
  multiSelect={false}
>
  - Grid layout with thumbnails
  - Pagination (50 per page)
  - Search by filename
  - Image metadata display
  - Delete functionality with confirmation
  - Selection mode for inserting into content
</MediaLibrary>
```

#### 5. Settings Components

**SettingsForm Component**
```jsx
<SettingsForm>
  <Tabs>
    <Tab label="General">
      <FormField label="Site Title" name="siteTitle" />
      <FormField label="Contact Email" name="contactEmail" />
      <FormField label="Phone Number" name="phoneNumber" />
    </Tab>
    <Tab label="SEO">
      <FormField label="Meta Title" name="metaTitle" maxLength={60} />
      <FormField label="Meta Description" name="metaDescription" maxLength={160} />
      <FormField label="OG Title" name="ogTitle" />
      <FormField label="OG Description" name="ogDescription" />
      <ImageUpload label="OG Image" name="ogImage" />
      <FormField label="Twitter Card" name="twitterCard" />
      <FormField label="Google Analytics ID" name="gaId" />
      <FormField label="Search Console Code" name="gscCode" />
      <FormField label="Custom Meta Tags" name="customMeta" type="textarea" />
    </Tab>
  </Tabs>
  <ButtonGroup>
    <Button onClick={save}>Save Settings</Button>
    <Button onClick={reset} variant="secondary">Reset</Button>
  </ButtonGroup>
</SettingsForm>
```

**NavigationManager Component**
```jsx
<NavigationManager>
  <Section label="Left Navigation">
    <NavLinkList 
      links={leftLinks}
      onAdd={addLeftLink}
      onRemove={removeLeftLink}
      onReorder={reorderLeftLinks}
    />
  </Section>
  <Section label="Right Navigation">
    <NavLinkList 
      links={rightLinks}
      onAdd={addRightLink}
      onRemove={removeRightLink}
      onReorder={reorderRightLinks}
    />
  </Section>
  <Section label="CTA Buttons">
    <CTAButton label="Primary" data={primaryCTA} />
    <CTAButton label="Secondary" data={secondaryCTA} />
  </Section>
  <Button onClick={saveNavigation}>Save Navigation</Button>
</NavigationManager>
```

#### 6. Shared UI Components

**NotificationContainer**
- Toast notifications for success/error messages
- Auto-dismiss after 5 seconds
- Positioned top-right

**LoadingSpinner**
- Displayed during async operations
- Overlay mode for full-page loading

**ConfirmDialog**
- Modal for destructive actions
- Used for delete confirmations

### Backend Components

#### 1. Middleware

**verifyToken Middleware**
```javascript
function verifyToken(req, res, next) {
  // Extract token from Authorization header
  // Verify JWT signature and expiration
  // Attach userId to request object
  // Call next() or return 401
}
```

**uploadMiddleware (Multer)**
```javascript
const upload = multer({
  storage: multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
      // Generate unique filename with timestamp
    }
  }),
  fileFilter: (req, file, cb) => {
    // Validate image MIME types
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});
```

**errorHandler Middleware**
```javascript
function errorHandler(err, req, res, next) {
  // Log error
  // Return appropriate status code and message
  // Sanitize error details in production
}
```

#### 2. Image Processing Service

**ImageProcessor Class**
```javascript
class ImageProcessor {
  async processUpload(file) {
    // Generate thumbnail (300x300)
    // Generate medium size (800w)
    // Preserve original
    // Return URLs for all variants
  }
  
  async generateThumbnail(inputPath, outputPath) {
    // Use Sharp to resize to 300x300
    // Maintain aspect ratio with cover
  }
  
  async generateMedium(inputPath, outputPath) {
    // Use Sharp to resize to 800w
    // Maintain aspect ratio
  }
  
  async deleteImage(filename) {
    // Delete all variants (original, thumbnail, medium)
  }
}
```

#### 3. Database Service Extensions

**MediaRepository**
```javascript
class MediaRepository {
  async create(mediaData) {
    // Insert media record with URLs
  }
  
  async findAll(page, limit, search) {
    // Query media with pagination and search
  }
  
  async findById(id) {
    // Get single media record
  }
  
  async delete(id) {
    // Delete media record
  }
}
```

**AuditRepository**
```javascript
class AuditRepository {
  async recordChange(entityType, entityId, userId, action) {
    // Insert audit trail record
  }
  
  async getHistory(entityType, entityId) {
    // Get audit history for entity
  }
}
```

## Data Models

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Services Table (Extended)
```sql
CREATE TABLE services (
  id VARCHAR(255) PRIMARY KEY,
  hero_title VARCHAR(255) NOT NULL,
  hero_tagline TEXT,
  hero_image VARCHAR(500),
  featured_image VARCHAR(500),
  description TEXT, -- JSON array of paragraphs
  highlights TEXT, -- JSON array of strings
  images TEXT, -- JSON array of image URLs
  cta TEXT, -- JSON object {text, buttonLabel}
  status VARCHAR(20) DEFAULT 'draft', -- 'draft' or 'published'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by INTEGER REFERENCES users(id)
);
```

#### Media Table (New)
```sql
CREATE TABLE media (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_size INTEGER NOT NULL,
  url_original VARCHAR(500) NOT NULL,
  url_thumbnail VARCHAR(500),
  url_medium VARCHAR(500),
  uploaded_by INTEGER REFERENCES users(id),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Global Settings Table (Extended)
```sql
CREATE TABLE global_settings (
  key VARCHAR(255) PRIMARY KEY,
  value TEXT NOT NULL,
  category VARCHAR(100), -- 'general', 'seo', 'contact'
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by INTEGER REFERENCES users(id)
);
```

#### Navigation Links Table
```sql
CREATE TABLE nav_links (
  id INTEGER PRIMARY KEY DEFAULT 1,
  left_links TEXT, -- JSON array
  right_links TEXT, -- JSON array
  cta_buttons TEXT, -- JSON object
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by INTEGER REFERENCES users(id)
);
```

#### Audit Trail Table (New)
```sql
CREATE TABLE audit_trail (
  id SERIAL PRIMARY KEY,
  entity_type VARCHAR(100) NOT NULL, -- 'service', 'media', 'settings', etc.
  entity_id VARCHAR(255) NOT NULL,
  action VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete'
  user_id INTEGER REFERENCES users(id),
  changes TEXT, -- JSON object of changed fields
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Data Transfer Objects (DTOs)

#### Service DTO
```typescript
interface ServiceDTO {
  id: string;
  heroTitle: string;
  heroTagline?: string;
  heroImage?: string;
  featuredImage?: string;
  description: string[]; // Array of paragraphs
  highlights: string[];
  images: string[];
  cta: {
    text: string;
    buttonLabel: string;
  };
  status: 'draft' | 'published';
  createdAt: string;
  createdBy: number;
  updatedAt: string;
  updatedBy: number;
}
```

#### Media DTO
```typescript
interface MediaDTO {
  id: number;
  filename: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  urls: {
    original: string;
    thumbnail: string;
    medium: string;
  };
  uploadedBy: number;
  uploadedAt: string;
}
```

#### Settings DTO
```typescript
interface SettingsDTO {
  general: {
    siteTitle: string;
    contactEmail: string;
    phoneNumber: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    twitterCard: string;
    gaId: string;
    gscCode: string;
    customMeta: string;
  };
}
```

#### Navigation DTO
```typescript
interface NavigationDTO {
  leftLinks: NavLink[];
  rightLinks: NavLink[];
  ctaButtons: {
    primary: CTAButton;
    secondary: CTAButton;
  };
}

interface NavLink {
  label: string;
  url: string;
  openInNewTab: boolean;
}

interface CTAButton {
  label: string;
  url: string;
  variant: 'primary' | 'secondary';
}
```

### API Request/Response Formats

#### Upload Image Response
```json
{
  "success": true,
  "data": {
    "id": 123,
    "urls": {
      "original": "/uploads/image-1234567890.jpg",
      "thumbnail": "/uploads/image-1234567890-thumb.jpg",
      "medium": "/uploads/image-1234567890-medium.jpg"
    },
    "filename": "image-1234567890.jpg",
    "originalName": "my-photo.jpg",
    "fileSize": 2048576
  }
}
```

#### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "File size exceeds maximum allowed size of 10MB",
    "field": "image"
  }
}
```
