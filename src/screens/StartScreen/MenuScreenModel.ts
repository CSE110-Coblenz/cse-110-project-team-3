/**
 * MenuScreenModel - holds small bits of state for the welcome menu
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
