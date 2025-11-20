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
 * - "simulation": simulation screen for specified level
 */

export type Screen =
  | { type: "rules" }
  | { type: "level" }
  | { type: "map" }
  | { type: "reference"; returnTo?: Screen }
  | {
      type: "minigame";
      screen: "title" | "rules" | "completed" | "gameover" | "simulation";
      level: number;
    }
  | { type: "topic"; level: "force" | "friction" | "distance" | "gravity" | "projectile motion" | "trajectory" }
  | {
      type: "simulation";
      topic: "force" | "friction" | "distance" | "gravity" | "projectile motion" | "trajectory";
      level: "lev1" | "lev2" | "lev3" | "lev4" | "lev5" | "lev6";
    };

export type RuleConfig = {
  rules: string[];
};

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
