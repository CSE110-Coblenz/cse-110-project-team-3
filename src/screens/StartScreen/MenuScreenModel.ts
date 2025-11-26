import type { Screen } from "../../types";

/**
 * MenuScreenModel - manages state for the welcome menu screen
 *
 * Stores the last meaningful screen (map, topic, simulation, etc.) so the
 * Resume button can take players back after they log in again.
 */
const LAST_SCREEN_KEY = "lastScreen";
const TOPIC_KEYS = [
  "force",
  "friction",
  "distance",
  "gravity",
  "projectile motion",
  "trajectory",
] as const;
const MINIGAME_SCREENS = [
  "title",
  "rules",
  "completed",
  "gameover",
  "simulation",
] as const;

type StoredScreen =
  | { type: "map" }
  | { type: "rules" }
  | { type: "level" }
  | {
      type: "topic";
      level: (typeof TOPIC_KEYS)[number];
    }
  | {
      type: "simulation";
      topic: (typeof TOPIC_KEYS)[number];
    }
  | {
      type: "minigame";
      screen: (typeof MINIGAME_SCREENS)[number];
      level: number;
    }
  | { type: "reference"; returnTo?: StoredScreen };

export class MenuScreenModel {
  private lastScreen: StoredScreen | null = null;

  load(): void {
    const raw = localStorage.getItem(LAST_SCREEN_KEY);
    if (!raw) {
      this.lastScreen = null;
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      if (MenuScreenModel.isStoredScreen(parsed)) {
        this.lastScreen = parsed;
      } else {
        this.lastScreen = null;
        MenuScreenModel.clearLastScreen();
      }
    } catch {
      this.lastScreen = null;
      MenuScreenModel.clearLastScreen();
    }
  }

  getHasResume(): boolean {
    return this.lastScreen !== null;
  }

  getLastScreen(): Screen | null {
    return this.lastScreen;
  }

  static setLastScreen(screen: Screen): void {
    const sanitized = MenuScreenModel.sanitizeScreen(screen);
    if (!sanitized) {
      return;
    }
    localStorage.setItem(LAST_SCREEN_KEY, JSON.stringify(sanitized));
  }

  static clearLastScreen(): void {
    localStorage.removeItem(LAST_SCREEN_KEY);
  }

  private static sanitizeScreen(screen: Screen): StoredScreen | null {
    switch (screen.type) {
      case "map":
      case "rules":
      case "level":
        return { type: screen.type };
      case "topic":
        return { type: "topic", level: screen.level };
      case "simulation":
        return { type: "simulation", topic: screen.topic };
      case "minigame":
        return {
          type: "minigame",
          screen: screen.screen,
          level: screen.level,
        };
      case "reference": {
        const sanitizedReturn =
          screen.returnTo && MenuScreenModel.sanitizeScreen(screen.returnTo);
        return sanitizedReturn
          ? { type: "reference", returnTo: sanitizedReturn }
          : { type: "reference" };
      }
      default:
        return null;
    }
  }

  private static isStoredScreen(value: unknown): value is StoredScreen {
    if (!value || typeof value !== "object") {
      return false;
    }
    const screen = value as Record<string, unknown>;
    switch (screen.type) {
      case "map":
      case "rules":
      case "level":
        return true;
      case "topic":
        return (
          typeof screen.level === "string" &&
          (TOPIC_KEYS as readonly string[]).includes(screen.level)
        );
      case "simulation":
        return (
          typeof screen.topic === "string" &&
          (TOPIC_KEYS as readonly string[]).includes(screen.topic)
        );
      case "minigame":
        return (
          typeof screen.level === "number" &&
          typeof screen.screen === "string" &&
          (MINIGAME_SCREENS as readonly string[]).includes(screen.screen)
        );
      case "reference":
        return (
          screen.returnTo === undefined ||
          MenuScreenModel.isStoredScreen(screen.returnTo)
        );
      default:
        return false;
    }
  }
}
