import initSqlJs from "sql.js";
import type { Database } from "sql.js";

/**
 * UserDataset - manages user data storage using SQLite
 *
 * Purpose: Stores and retrieves user information (usernames) in SQLite database.
 * This allows the application to track users across sessions with a proper database.
 */

export interface UserData {
  username: string;
  createdAt: string;
  lastLoginAt: string;
}

// Database instance (initialized lazily)
let db: Database | null = null;
let dbInitialized = false;

// Fallback to localStorage key for current username (for compatibility)
const USERNAME_KEY = "currentUsername";
const DB_STORAGE_KEY = "userDatabase";

/**
 * Initialize the SQLite database
 */
async function initializeDatabase(): Promise<Database> {
  if (db && dbInitialized) {
    return db;
  }

  try {
    // Initialize SQL.js
    const SQL = await initSqlJs({
      locateFile: (file: string) => {
        // For Vite, we need to copy the wasm file to public or use a CDN
        // Using jsdelivr CDN as a reliable source
        return `https://cdn.jsdelivr.net/npm/sql.js@1.10.3/dist/${file}`;
      },
    });

    // Try to load existing database from localStorage
    const savedDb = localStorage.getItem(DB_STORAGE_KEY);
    if (savedDb) {
      const uint8Array = new Uint8Array(JSON.parse(savedDb));
      db = new SQL.Database(uint8Array);
    } else {
      // Create new database
      db = new SQL.Database();
    }

    // Create users table if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        username TEXT PRIMARY KEY,
        createdAt TEXT NOT NULL,
        lastLoginAt TEXT NOT NULL
      )
    `);

    dbInitialized = true;
    return db;
  } catch (error) {
    console.error("Failed to initialize SQLite database:", error);
    // Fallback: create an in-memory database
    const SQL = await initSqlJs({
      locateFile: (file: string) =>
        `https://cdn.jsdelivr.net/npm/sql.js@1.10.3/dist/${file}`,
    });
    db = new SQL.Database();
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        username TEXT PRIMARY KEY,
        createdAt TEXT NOT NULL,
        lastLoginAt TEXT NOT NULL
      )
    `);
    dbInitialized = true;
    return db;
  }
}

/**
 * Save the database to localStorage
 */
function saveDatabase(): void {
  if (!db) return;

  try {
    const data = db.export();
    const buffer = Array.from(data);
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(buffer));
  } catch (error) {
    console.error("Failed to save database:", error);
  }
}

export class UserDataset {
  /**
   * Ensure database is initialized (call this before any database operations)
   */
  private static async ensureDb(): Promise<Database> {
    if (!dbInitialized) {
      await initializeDatabase();
    }
    return db!;
  }

  /**
   * Get the current logged-in username
   */
  static getCurrentUsername(): string | null {
    // For compatibility, also check localStorage
    return localStorage.getItem(USERNAME_KEY);
  }

  /**
   * Set the current logged-in username
   */
  static async setCurrentUsername(username: string): Promise<void> {
    if (!username || username.trim() === "") {
      return;
    }
    const trimmedUsername = username.trim();
    
    // Store in localStorage for quick access
    localStorage.setItem(USERNAME_KEY, trimmedUsername);

    // Also add to the database
    await this.addUser(trimmedUsername);
  }

  /**
   * Clear the current username (logout)
   */
  static clearCurrentUsername(): void {
    localStorage.removeItem(USERNAME_KEY);
  }

  /**
   * Add a user to the dataset
   */
  static async addUser(username: string): Promise<void> {
    try {
      const database = await this.ensureDb();
      const now = new Date().toISOString();

      // Check if user already exists
      const existingUser = await this.getUser(username);
      if (existingUser) {
        // Update last login time
        database.run(
          `UPDATE users SET lastLoginAt = ? WHERE username = ?`,
          [now, username]
        );
      } else {
        // Add new user
        database.run(
          `INSERT INTO users (username, createdAt, lastLoginAt) VALUES (?, ?, ?)`,
          [username, now, now]
        );
      }

      saveDatabase();
    } catch (error) {
      console.warn("Failed to add user to database, using localStorage only:", error);
      // Continue without database - localStorage is already updated in setCurrentUsername
    }
  }

  /**
   * Get all users from the dataset
   */
  static async getAllUsers(): Promise<UserData[]> {
    const database = await this.ensureDb();
    const result = database.exec("SELECT * FROM users ORDER BY createdAt DESC");

    if (result.length === 0) {
      return [];
    }

    const rows = result[0].values;
    return rows.map((row) => ({
      username: row[0] as string,
      createdAt: row[1] as string,
      lastLoginAt: row[2] as string,
    }));
  }

  /**
   * Get a specific user by username
   */
  static async getUser(username: string): Promise<UserData | null> {
    const database = await this.ensureDb();
    const stmt = database.prepare("SELECT * FROM users WHERE username = ?");
    stmt.bind([username]);
    
    if (!stmt.step()) {
      stmt.free();
      return null;
    }

    const row = stmt.getAsObject() as { username: string; createdAt: string; lastLoginAt: string };
    stmt.free();
    
    return {
      username: row.username,
      createdAt: row.createdAt,
      lastLoginAt: row.lastLoginAt,
    };
  }

  /**
   * Clear all user data
   */
  static async clearAllUsers(): Promise<void> {
    const database = await this.ensureDb();
    database.run("DELETE FROM users");
    saveDatabase();
    localStorage.removeItem(USERNAME_KEY);
  }

  /**
   * Initialize the database (call this when the app starts)
   */
  static async initialize(): Promise<void> {
    await initializeDatabase();
  }
}
