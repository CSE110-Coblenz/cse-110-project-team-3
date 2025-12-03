import { UserDataset } from "../../dataset/UserDataset";

/**
 * LoginScreenModel - manages state for the login screen
 *
 * Purpose: Handles username input validation and storage
 */
export class LoginScreenModel {
  private username: string = "";

  setUsername(username: string): void {
    this.username = username;
  }

  getUsername(): string {
    return this.username;
  }

  /**
   * Validate username (non-empty, trimmed)
   */
  isValid(): boolean {
    return this.username.trim().length > 0;
  }

  /**
   * Save username to dataset and return success status
   */
  async login(): Promise<boolean> {
    if (!this.isValid()) {
      return false;
    }

    const trimmedUsername = this.username.trim();
    await UserDataset.setCurrentUsername(trimmedUsername);
    return true;
  }

  /**
   * Check if there's already a logged-in user
   */
  hasExistingUser(): boolean {
    return UserDataset.getCurrentUsername() !== null;
  }

  /**
   * Get existing username if available
   */
  getExistingUsername(): string | null {
    return UserDataset.getCurrentUsername();
  }
}
