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
  | { type: "topic"; level: "friction" | "projectile motion" }
  | { type: "reference" };

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
