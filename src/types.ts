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
  | { type: "topic"; level: "friction" | "projectile motion" }
  | {
      type: "minigame";
      screen: "title" | "rules" | "completed" | "gameover" | "simulation";
      level: number;
    }
  | {
      type: "simulation";
      topic: "friction" | "projectile motion";
      level: "lev1" | "lev2";
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

export abstract class MinigameController extends ScreenController {
  abstract playSimulation(): void;
  abstract resetSimulation(): void;
}

export interface ScreenSwitcher {
  switchToScreen(screen: Screen): void;
}
