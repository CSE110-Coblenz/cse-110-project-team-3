/**
 * MenuScreenModel - manages state for the welcome menu screen
 *
 * Purpose: Tracks the last screen the user visited so the "Resume" button
 * can take them back to where they were. This provides a convenient way
 * for users to continue their game session from the menu screen.
 *
 * How it works:
 * - When navigating away from a screen (e.g., map, rules), that screen
 *   calls MenuScreenModel.setLastScreen() to save its type
 * - When the menu screen loads, it checks if there's a last screen saved
 * - If a last screen exists, the Resume button is enabled
 * - Clicking Resume navigates back to the last screen the user was on
 */
const LAST_SCREEN_KEY = "lastScreen";

export class MenuScreenModel {
  private lastScreen: string | null = null;

  load(): void {
    this.lastScreen = localStorage.getItem(LAST_SCREEN_KEY);
  }

  getHasResume(): boolean {
    return !!this.lastScreen;
  }

  getLastScreen(): string | null {
    return this.lastScreen;
  }

  /** Call this from other screens when you route away, if you want Resume to work. */
  static setLastScreen(screenType: string) {
    if (screenType && screenType !== "menu") {
      localStorage.setItem(LAST_SCREEN_KEY, screenType);
    }
  }

  static clearLastScreen() {
    localStorage.removeItem(LAST_SCREEN_KEY);
  }
}
