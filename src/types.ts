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
  | { type: "topic"; level: "friction" | "projectile motion" };

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

/**
 * Button position on the screen
 */
export interface ButtonPosition {
  x?: number; // x position relative to screen width (0-1)
  y?: number; // y position relative to screen height (0-1)
  align?: "left" | "center" | "right";
}

/**
 * Screen button configuration
 * - id: Unique identifier for the button
 * - label: Text displayed on the button
 * - target: Screen to navigate to when the button is clicked
 * - position: Optional position of the button on the screen
 * - style: Optional styling for the button
 */
export interface Button {
  id: string;
  label: string;
  target: Screen;
  position?: ButtonPosition;
  style?: {
    fill?: string;
    color?: string;
    textFill?: string;
    stroke?: string;
    width?: number;
    height?: number;
  };
}

/**
 * Configuration for a screen
 * - title: Title of the screen
 * - description: Description text for the screen
 * - buttons: Array of buttons to display on the screen
 * - style: Optional styling for the screen
 */
export interface ScreenConfig {
  title: string;
  description: string;
  buttons: Button[];
  style?: {
    titleColor: string;
    descriptionColor: string;
    backgroundColor: string;
  };
}