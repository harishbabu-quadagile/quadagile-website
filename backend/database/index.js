const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../data/quadagile.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let db = null;

const getDatabase = () => {
  if (!db) {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err);
      } else {
        console.log('Connected to SQLite database');
      }
    });
  }
  return db;
};

const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    const database = getDatabase();
    
    database.serialize(() => {
      // Users table
      database.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          name TEXT NOT NULL,
          role TEXT DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Blogs table
      database.run(`
        CREATE TABLE IF NOT EXISTS blogs (
          id TEXT PRIMARY KEY,
          slug TEXT UNIQUE NOT NULL,
          title TEXT NOT NULL,
          excerpt TEXT NOT NULL,
          content TEXT NOT NULL,
          featured_image TEXT,
          author TEXT NOT NULL,
          published_at DATETIME,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
          meta_title TEXT,
          meta_description TEXT,
          tags TEXT,
          created_by TEXT,
          FOREIGN KEY (created_by) REFERENCES users(id)
        )
      `);

      // Case Studies table
      database.run(`
        CREATE TABLE IF NOT EXISTS case_studies (
          id TEXT PRIMARY KEY,
          slug TEXT UNIQUE NOT NULL,
          title TEXT NOT NULL,
          subtitle TEXT NOT NULL,
          excerpt TEXT NOT NULL,
          content TEXT NOT NULL,
          featured_image TEXT,
          client_name TEXT NOT NULL,
          industry TEXT NOT NULL,
          duration TEXT NOT NULL,
          results TEXT,
          published_at DATETIME,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
          meta_title TEXT,
          meta_description TEXT,
          created_by TEXT,
          FOREIGN KEY (created_by) REFERENCES users(id)
        )
      `);

      // Contact submissions table
      database.run(`
        CREATE TABLE IF NOT EXISTS contact_submissions (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          company TEXT,
          message TEXT NOT NULL,
          ip_address TEXT,
          user_agent TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, async (err) => {
        if (err) {
          reject(err);
          return;
        }

        // Create default admin user if not exists
        try {
          await createDefaultAdminUser();
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  });
};

const createDefaultAdminUser = async () => {
  const database = getDatabase();
  const { v4: uuidv4 } = require('uuid');
  
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@quadagile.in';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  
  return new Promise((resolve, reject) => {
    database.get('SELECT * FROM users WHERE email = ?', [adminEmail], async (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      
      if (!row) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        const userId = uuidv4();
        
        database.run(
          `INSERT INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)`,
          [userId, adminEmail, hashedPassword, 'Admin User', 'admin'],
          (err) => {
            if (err) {
              reject(err);
            } else {
              console.log('Default admin user created:', adminEmail);
              resolve();
            }
          }
        );
      } else {
        resolve();
      }
    });
  });
};

// Promisified database methods
const runQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    const database = getDatabase();
    database.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
};

const getOne = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    const database = getDatabase();
    database.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

const getAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    const database = getDatabase();
    database.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

module.exports = {
  getDatabase,
  initializeDatabase,
  runQuery,
  getOne,
  getAll,
};
