const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

class Database {
  constructor() {
    this.db = new sqlite3.Database(path.join(__dirname, 'cms.db'));
    this.init();
  }

  init() {
    this.db.serialize(() => {
      // Users table
      this.db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Services table
      this.db.run(`CREATE TABLE IF NOT EXISTS services (
        id TEXT PRIMARY KEY,
        heroTitle TEXT NOT NULL,
        heroTagline TEXT,
        heroImage TEXT,
        featuredImage TEXT,
        description TEXT,
        highlights TEXT,
        images TEXT,
        cta TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Navigation links table
      this.db.run(`CREATE TABLE IF NOT EXISTS nav_links (
        id INTEGER PRIMARY KEY,
        leftLinks TEXT,
        rightLinks TEXT,
        ctaButtons TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Global settings table
      this.db.run(`CREATE TABLE IF NOT EXISTS global_settings (
        key TEXT PRIMARY KEY,
        value TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Create default admin user
      this.createDefaultUser();
      this.seedInitialData();
    });
  }

  createDefaultUser() {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    this.db.run(
      'INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)',
      ['admin', hashedPassword]
    );
  }

  seedInitialData() {
    // Seed services data
    const servicesData = {
      'private-luxury-transport': {
        id: 'private-luxury-transport',
        heroTitle: 'Private Luxury Transport',
        heroTagline: 'Designed for individuals and families seeking comfort, privacy, and reliability.',
        heroImage: '/image/mltqxr0s-tvy6qwy.png',
        featuredImage: '/image/mltqxr0s-tvy6qwy.png',
        description: JSON.stringify([
          'Our private luxury transport service offers a discreet, personalized travel experience tailored to your preferences.',
          'Each journey is crafted with attention to detail, ensuring a seamless experience from pickup to destination.'
        ]),
        highlights: JSON.stringify(['Discreet Chauffeurs', 'Premium SUVs', 'Privacy-Focused Travel', 'Flexible Scheduling', 'Door-to-Door Service', 'Refined Presentation']),
        images: JSON.stringify(['/image/mltqxr0s-tvy6qwy.png', '/image/mltqxr0s-0ykx36e.png']),
        cta: JSON.stringify({ text: 'Travel, Thoughtfully Arranged', buttonLabel: 'Book Private Transport' })
      }
    };

    Object.values(servicesData).forEach(service => {
      this.db.run(
        'INSERT OR IGNORE INTO services (id, heroTitle, heroTagline, heroImage, featuredImage, description, highlights, images, cta) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [service.id, service.heroTitle, service.heroTagline, service.heroImage, service.featuredImage, service.description, service.highlights, service.images, service.cta]
      );
    });

    // Seed navigation data
    const navData = {
      leftLinks: JSON.stringify([
        { label: 'Services', url: '/services', openInNewTab: false },
        { label: 'About Us', url: '/about', openInNewTab: false }
      ]),
      rightLinks: JSON.stringify([
        { label: 'Experience', url: '/experience', openInNewTab: false },
        { label: 'Contact', url: '/contact', openInNewTab: false }
      ]),
      ctaButtons: JSON.stringify({
        primary: { label: 'Become a member', url: '/membership', variant: 'primary' },
        secondary: { label: 'Login', url: '/login', variant: 'secondary' }
      })
    };

    this.db.run(
      'INSERT OR IGNORE INTO nav_links (id, leftLinks, rightLinks, ctaButtons) VALUES (1, ?, ?, ?)',
      [navData.leftLinks, navData.rightLinks, navData.ctaButtons]
    );
  }

  getDb() {
    return this.db;
  }
}

module.exports = Database;