import type { Group } from "konva/lib/Group";

export interface View {
  getGroup(): Group;
  show(): void;
  hide(): void;
}

/**
 * Screen types for navigation
 *
 * - "menu": Menu/Start screen
 * - "rules": Rules screen
 * - "level": Level screen
 * - "map": Map screen
 */
export type Screen = { type: "menu" } | { type: "rules" } | { type: "level" } | { type: "map" };

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
