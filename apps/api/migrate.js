const sqlite3 = require('sqlite3').verbose();
const SupabaseDatabase = require('./supabase-database');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

class DataMigration {
  constructor() {
    this.sqliteDb = null;
    this.supabaseDb = new SupabaseDatabase();
  }

  async migrate() {
    try {
      console.log('Starting migration from SQLite to Supabase...');
      
      // Check if SQLite database exists
      const sqlitePath = path.join(__dirname, 'cms.db');
      if (!fs.existsSync(sqlitePath)) {
        console.log('No existing SQLite database found. Skipping data migration.');
        console.log('Please run the SQL schema in your Supabase dashboard.');
        return;
      }

      this.sqliteDb = new sqlite3.Database(sqlitePath);
      
      await this.migrateUsers();
      await this.migrateServices();
      await this.migrateNavLinks();
      await this.migrateGlobalSettings();
      
      console.log('Migration completed successfully!');
      
    } catch (error) {
      console.error('Migration failed:', error);
    } finally {
      if (this.sqliteDb) {
        this.sqliteDb.close();
      }
      this.supabaseDb.close();
    }
  }

  async seedServices() {
    try {
      console.log('Seeding services data...');
      
      const servicesData = {
        'private-luxury-transport': {
          id: 'private-luxury-transport',
          heroTitle: 'Private Luxury Transport',
          heroTagline: 'Designed for individuals and families seeking comfort, privacy, and reliability.',
          heroImage: '/image/mltqxr0s-tvy6qwy.png',
          description: [
            'Our private luxury transport service offers a discreet, personalized travel experience tailored to your preferences.',
            'Each journey is crafted with attention to detail, ensuring a seamless experience from pickup to destination.',
            'We understand that privacy and comfort are paramount. Our fleet of premium SUVs and sedans offers spacious interiors.',
            'Whether you\'re traveling for business, pleasure, or family occasions, our private luxury transport service delivers reliability.',
            'Trust King & Carter Premier to provide a refined, thoughtful approach to private travel.'
          ],
          highlights: ['Discreet Chauffeurs', 'Premium SUVs', 'Privacy-Focused Travel', 'Flexible Scheduling', 'Door-to-Door Service', 'Refined Presentation'],
          images: ['/image/mltqxr0s-tvy6qwy.png', '/image/mltqxr0s-0ykx36e.png', '/image/mltqxr0s-5bj4l8e.png', '/image/mltqxr0s-koo2o1u.png', '/image/mltqxr0s-hynsmyb.png', '/image/mltqxr0s-3fog7d9.png', '/image/mltqxr0s-ch5rmk1.png'],
          cta: {text: 'Travel, Thoughtfully Arranged', buttonLabel: 'Book Private Transport'}
        },
        'corporate-executive-travel': {
          id: 'corporate-executive-travel',
          heroTitle: 'Corporate & Executive Travel',
          heroTagline: 'Professional transportation solutions for business leaders and corporate teams.',
          heroImage: '/image/mltqxr0s-0ykx36e.png',
          description: [
            'Our corporate and executive travel service is designed for business professionals who demand reliability.',
            'From airport transfers to multi-city business trips, our experienced chauffeurs ensure you arrive on time.',
            'We offer flexible corporate accounts, priority scheduling, and dedicated account management.',
            'Our commitment to discretion and professionalism means your business conversations remain private.',
            'Partner with King & Carter Premier for corporate travel that enhances productivity.'
          ],
          highlights: ['Punctual & Reliable Service', 'Executive Fleet Vehicles', 'Corporate Account Management', 'Mobile Office Environment', 'Professional Chauffeurs', 'Flexible Scheduling', 'Confidential & Discreet', 'Priority Booking'],
          images: ['/image/mltqxr0s-tvy6qwy.png', '/image/mltqxr0s-0ykx36e.png', '/image/mltqxr0s-5bj4l8e.png', '/image/mltqxr0s-koo2o1u.png', '/image/mltqxr0s-hynsmyb.png', '/image/mltqxr0s-3fog7d9.png', '/image/mltqxr0s-ch5rmk1.png'],
          cta: {text: 'Elevate Your Business Travel', buttonLabel: 'Book Corporate Service'}
        },
        'airport-hotel-transfers': {
          id: 'airport-hotel-transfers',
          heroTitle: 'Airport & Hotel Transfers',
          heroTagline: 'Seamless, punctual transfers for stress-free arrivals and departures.',
          heroImage: '/image/mltqxr0s-5bj4l8e.png',
          description: [
            'Our airport and hotel transfer service eliminates the stress of travel logistics.',
            'From the moment you book, we handle every detail.',
            'We understand that travel can be unpredictable.',
            'For hotel transfers, we provide prompt, reliable service that respects your schedule.',
            'Experience the difference of professional airport and hotel transfer service.'
          ],
          highlights: ['Flight Monitoring', 'Meet & Greet Service', '24/7 Availability', 'Luggage Assistance', 'All Major Airports', 'Hotel Coordination', 'Flexible Pickup Windows', 'Professional Drivers'],
          images: ['/image/mltqxr0s-tvy6qwy.png', '/image/mltqxr0s-0ykx36e.png', '/image/mltqxr0s-5bj4l8e.png', '/image/mltqxr0s-koo2o1u.png', '/image/mltqxr0s-hynsmyb.png', '/image/mltqxr0s-3fog7d9.png', '/image/mltqxr0s-ch5rmk1.png'],
          cta: {text: 'Arrive in Comfort and Style', buttonLabel: 'Book Airport Transfer'}
        },
        'special-engagements-events': {
          id: 'special-engagements-events',
          heroTitle: 'Special Engagements & Events',
          heroTagline: 'Elegant transportation for weddings, galas, and memorable occasions.',
          heroImage: '/image/mltqxr0s-koo2o1u.png',
          description: [
            'Your special occasions deserve transportation that matches their significance.',
            'From weddings to galas, corporate events to milestone celebrations, we provide elegant transportation.',
            'Our chauffeurs understand the importance of timing and presentation for special events.',
            'We work closely with event planners, venues, and coordinators to ensure seamless transportation.',
            'Make your special occasion truly unforgettable with transportation that reflects the elegance of your event.'
          ],
          highlights: ['Wedding Transportation', 'Gala & Black-Tie Events', 'Corporate Functions', 'Anniversary Celebrations', 'Impeccably Presented Fleet', 'Event Coordination', 'Flexible Scheduling', 'Professional Chauffeurs'],
          images: ['/image/mltqxr0s-tvy6qwy.png', '/image/mltqxr0s-0ykx36e.png', '/image/mltqxr0s-5bj4l8e.png', '/image/mltqxr0s-koo2o1u.png', '/image/mltqxr0s-hynsmyb.png', '/image/mltqxr0s-3fog7d9.png', '/image/mltqxr0s-ch5rmk1.png'],
          cta: {text: 'Make Your Occasion Unforgettable', buttonLabel: 'Book Event Transportation'}
        }
      };

      const promises = Object.values(servicesData).map(service => {
        return new Promise((resolve, reject) => {
          this.supabaseDb.run(
            'INSERT INTO services (id, hero_title, hero_tagline, hero_image, description, highlights, images, cta, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (id) DO UPDATE SET hero_title = $2, hero_tagline = $3, hero_image = $4, description = $5, highlights = $6, images = $7, cta = $8, updated_at = $9',
            [
              service.id,
              service.heroTitle,
              service.heroTagline,
              service.heroImage,
              JSON.stringify(service.description),
              JSON.stringify(service.highlights),
              JSON.stringify(service.images),
              JSON.stringify(service.cta),
              new Date().toISOString()
            ],
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        });
      });

      await Promise.all(promises);
      console.log('Services seeded successfully!');
      
    } catch (error) {
      console.error('Seeding services failed:', error);
      throw error;
    }
  }

  async seedAdmin() {
    try {
      console.log('Seeding admin user...');
      const bcrypt = require('bcryptjs');
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      
      return new Promise((resolve, reject) => {
        this.supabaseDb.run(
          'INSERT INTO users (id, username, password, created_at) VALUES ($1, $2, $3, $4) ON CONFLICT (username) DO UPDATE SET password = $2',
          [1, 'admin', hashedPassword, new Date().toISOString()],
          (err) => {
            if (err) {
              console.error('Seeding admin failed:', err);
              reject(err);
            } else {
              console.log('Admin user seeded successfully!');
              resolve();
            }
          }
        );
      });
    } catch (error) {
      console.error('Seeding admin failed:', error);
      throw error;
    }
  }

  migrateUsers() {
    return new Promise((resolve, reject) => {
      this.sqliteDb.all('SELECT * FROM users', [], (err, rows) => {
        if (err) {
          console.log('No users table found in SQLite, skipping...');
          return resolve();
        }

        if (rows.length === 0) {
          console.log('No users to migrate');
          return resolve();
        }

        console.log(`Migrating ${rows.length} users...`);
        
        const promises = rows.map(row => {
          return new Promise((resolveUser, rejectUser) => {
            this.supabaseDb.run(
              'INSERT INTO users (id, username, password, created_at) VALUES ($1, $2, $3, $4) ON CONFLICT (username) DO NOTHING',
              [row.id, row.username, row.password, row.created_at],
              (err) => {
                if (err) rejectUser(err);
                else resolveUser();
              }
            );
          });
        });

        Promise.all(promises)
          .then(() => {
            console.log('Users migrated successfully');
            resolve();
          })
          .catch(reject);
      });
    });
  }

  migrateServices() {
    return new Promise((resolve, reject) => {
      this.sqliteDb.all('SELECT * FROM services', [], (err, rows) => {
        if (err) {
          console.log('No services table found in SQLite, skipping...');
          return resolve();
        }

        if (rows.length === 0) {
          console.log('No services to migrate');
          return resolve();
        }

        console.log(`Migrating ${rows.length} services...`);
        
        const promises = rows.map(row => {
          return new Promise((resolveService, rejectService) => {
            this.supabaseDb.run(
              'INSERT INTO services (id, hero_title, hero_tagline, hero_image, featured_image, description, highlights, images, cta, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (id) DO UPDATE SET hero_title = $2, hero_tagline = $3, hero_image = $4, featured_image = $5, description = $6, highlights = $7, images = $8, cta = $9, updated_at = $10',
              [
                row.id,
                row.heroTitle,
                row.heroTagline,
                row.heroImage,
                row.featuredImage,
                row.description,
                row.highlights,
                row.images,
                row.cta,
                row.updated_at
              ],
              (err) => {
                if (err) rejectService(err);
                else resolveService();
              }
            );
          });
        });

        Promise.all(promises)
          .then(() => {
            console.log('Services migrated successfully');
            resolve();
          })
          .catch(reject);
      });
    });
  }

  migrateNavLinks() {
    return new Promise((resolve, reject) => {
      this.sqliteDb.all('SELECT * FROM nav_links', [], (err, rows) => {
        if (err) {
          console.log('No nav_links table found in SQLite, skipping...');
          return resolve();
        }

        if (rows.length === 0) {
          console.log('No navigation links to migrate');
          return resolve();
        }

        console.log(`Migrating ${rows.length} navigation entries...`);
        
        const promises = rows.map(row => {
          return new Promise((resolveNav, rejectNav) => {
            this.supabaseDb.run(
              'INSERT INTO nav_links (id, left_links, right_links, cta_buttons, updated_at) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO UPDATE SET left_links = $2, right_links = $3, cta_buttons = $4, updated_at = $5',
              [
                row.id,
                row.leftLinks,
                row.rightLinks,
                row.ctaButtons,
                row.updated_at
              ],
              (err) => {
                if (err) rejectNav(err);
                else resolveNav();
              }
            );
          });
        });

        Promise.all(promises)
          .then(() => {
            console.log('Navigation links migrated successfully');
            resolve();
          })
          .catch(reject);
      });
    });
  }

  migrateGlobalSettings() {
    return new Promise((resolve, reject) => {
      this.sqliteDb.all('SELECT * FROM global_settings', [], (err, rows) => {
        if (err) {
          console.log('No global_settings table found in SQLite, skipping...');
          return resolve();
        }

        if (rows.length === 0) {
          console.log('No global settings to migrate');
          return resolve();
        }

        console.log(`Migrating ${rows.length} global settings...`);
        
        const promises = rows.map(row => {
          return new Promise((resolveSetting, rejectSetting) => {
            this.supabaseDb.run(
              'INSERT INTO global_settings (key, value, updated_at) VALUES ($1, $2, $3) ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = $3',
              [row.key, row.value, row.updated_at],
              (err) => {
                if (err) rejectSetting(err);
                else resolveSetting();
              }
            );
          });
        });

        Promise.all(promises)
          .then(() => {
            console.log('Global settings migrated successfully');
            resolve();
          })
          .catch(reject);
      });
    });
  }
}

// Run migration if called directly
if (require.main === module) {
  const migration = new DataMigration();
  
  // Check command line arguments
  const args = process.argv.slice(2);
  
  if (args.includes('--seed-services')) {
    migration.seedServices().then(() => {
      migration.supabaseDb.close();
    }).catch(error => {
      console.error('Seeding failed:', error);
      migration.supabaseDb.close();
    });
  } else if (args.includes('--seed-admin')) {
    migration.seedAdmin().then(() => {
      migration.supabaseDb.close();
    }).catch(error => {
      console.error('Seeding admin failed:', error);
      migration.supabaseDb.close();
    });
  } else if (args.includes('--seed-all')) {
    migration.seedAdmin().then(() => {
      return migration.seedServices();
    }).then(() => {
      migration.supabaseDb.close();
    }).catch(error => {
      console.error('Seeding failed:', error);
      migration.supabaseDb.close();
    });
  } else {
    migration.migrate();
  }
}

module.exports = DataMigration;