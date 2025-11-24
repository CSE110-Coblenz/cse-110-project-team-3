/**
 * UserDataset - manages user data storage
 *
 * Purpose: Stores and retrieves user information (usernames) in localStorage.
 * This allows the application to track users across sessions.
 */

const USERNAME_KEY = "currentUsername";
const USERS_KEY = "allUsers";

export interface UserData {
  username: string;
  createdAt: string;
  lastLoginAt: string;
}

export class UserDataset {
  /**
   * Get the current logged-in username
   */
  static getCurrentUsername(): string | null {
    return localStorage.getItem(USERNAME_KEY);
  }

  /**
   * Set the current logged-in username
   */
  static setCurrentUsername(username: string): void {
    if (!username || username.trim() === "") {
      return;
    }
    const trimmedUsername = username.trim();
    localStorage.setItem(USERNAME_KEY, trimmedUsername);

    // Also add to the list of all users
    this.addUser(trimmedUsername);
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
  static addUser(username: string): void {
    const users = this.getAllUsers();
    const now = new Date().toISOString();

    // Check if user already exists
    const existingUser = users.find((u) => u.username === username);
    if (existingUser) {
      // Update last login time
      existingUser.lastLoginAt = now;
    } else {
      // Add new user
      users.push({
        username,
        createdAt: now,
        lastLoginAt: now,
      });
    }

    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  /**
   * Get all users from the dataset
   */
  static getAllUsers(): UserData[] {
    const usersJson = localStorage.getItem(USERS_KEY);
    if (!usersJson) {
      return [];
    }
    try {
      return JSON.parse(usersJson);
    } catch {
      return [];
    }
  }

  /**
   * Get a specific user by username
   */
  static getUser(username: string): UserData | null {
    const users = this.getAllUsers();
    return users.find((u) => u.username === username) || null;
  }

  /**
   * Clear all user data
   */
  static clearAllUsers(): void {
    localStorage.removeItem(USERS_KEY);
    localStorage.removeItem(USERNAME_KEY);
  }
}
