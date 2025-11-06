import type { Group } from "konva/lib/Group";

export interface View {
  getGroup(): Group;
  show(): void;
  hide(): void;
}

/**
 * Screen types for navigation
 *
 * - "rules": Rulesscreen
 * - "level": Levelscreen
 * - "map": Mapscreen
 * - "topic": Topic screen with specified level
 */

export type Screen =
  | { type: "rules" }
  | { type: "level" }
  | { type: "map" }
  | { type: "simulation" }
  | { type: "topic"; level: "friction" | "projectile motion" }
  | { type: "minigame" };

export abstract class ScreenController {
  abstract getView(): View;

  show(): void {
    this.getView().show();
  }

  hide(): void {
    this.getView().hide();
  }
}

export interface ScreenSwitcher {
  switchToScreen(screen: Screen): void;
}
