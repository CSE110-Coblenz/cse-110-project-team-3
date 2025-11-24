import type { Group } from "konva/lib/Group";
import { COLORS, FONT_FAMILY, STAGE_HEIGHT, STAGE_WIDTH } from "./constants";
import Konva from "konva";

export interface View {
  getGroup(): Group;
  show(): void;
  hide(): void;
}

/**
 * Screen types for navigation
 *
 * - "login": Login screen for username entry
 * - "menu": Menu/Start screen
 * - "rules": Rules screen
 * - "level": Level screen
 * - "map": Map screen
 * - "reference": Reference screen with optional return navigation
 * - "topic": Topic screen with specified level
 * - "simulation": Simulation screen for specified level
 * - "minigame": Minigame screen with sub-screen and level
 */

export type Screen =
  | { type: "login" }
  | { type: "menu" }
  | { type: "rules" }
  | { type: "level" }
  | { type: "map" }
  | { type: "reference"; returnTo?: Screen }
  | {
      type: "minigame";
      screen: "title" | "rules" | "completed" | "gameover" | "simulation";
      level: number;
    }
  | {
      type: "topic";
      level:
        | "force"
        | "friction"
        | "distance"
        | "gravity"
        | "projectile motion"
        | "trajectory";
    }
  | {
      type: "simulation";
      topic:
        | "force"
        | "friction"
        | "distance"
        | "gravity"
        | "projectile motion"
        | "trajectory";
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

export abstract class MinigameController extends ScreenController {
  abstract getView(): BaseMinigameSimulView;

  protected lives: number = 3;
  protected level: number;
  protected screenSwitcher: ScreenSwitcher;

  constructor(screenSwitcher: ScreenSwitcher, level: number) {
    super();
    this.screenSwitcher = screenSwitcher;
    this.level = level;
  }

  abstract playSimulation(): void;
  abstract resetSimulation(): void;

  protected handleHit(hit: boolean): void {
    if (hit) {
      this.screenSwitcher.switchToScreen({
        type: "minigame",
        screen: "completed",
        level: this.level,
      });
    } else {
      this.lives = Math.max(0, this.lives - 1);
      this.getView().setLives(this.lives);
      if (this.lives <= 0) {
        this.screenSwitcher.switchToScreen({
          type: "minigame",
          screen: "gameover",
          level: this.level,
        });
        return;
      }
      this.getView().addResetButton();
    }
  }
}

export abstract class BaseMinigameSimulModel {
  protected initial_speed: number;
  protected distance_x: number;
  protected margin_of_error: number;
  protected gravity: number;

  constructor(
    initial_speed: number,
    distance_x: number,
    margin_of_error: number,
    gravity: number,
  ) {
    this.initial_speed = initial_speed;
    this.distance_x = distance_x;
    this.margin_of_error = margin_of_error;
    this.gravity = gravity;
  }

  getInitialSpeed(): number {
    return this.initial_speed;
  }

  setInitialSpeed(v: number): void {
    const rounded = Math.round(v);
    const clamped = Math.max(0, Math.min(rounded, 300));
    this.initial_speed = clamped;
  }

  getDistanceX(): number {
    return this.distance_x;
  }

  getMarginOfError(): number {
    return this.margin_of_error;
  }

  getGravity(): number {
    return this.gravity;
  }

  isHit(landingDistance: number): boolean {
    return Math.abs(landingDistance - this.distance_x) <= this.margin_of_error;
  }
}

export abstract class BaseMinigameSimulView implements View {
  protected group: Konva.Group;
  protected playButton: Konva.Group;
  protected resetButton: Konva.Group;
  protected heartsGroup: Konva.Group;

  constructor(handlePlay?: () => void, handleReset?: () => void) {
    this.group = new Konva.Group();

    // Background
    const background = new Konva.Rect({
      x: 0,
      y: 0,
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
      fill: COLORS.bg,
      cornerRadius: 8,
    });
    this.group.add(background);

    // Hearts (lives) display at top-right
    this.heartsGroup = new Konva.Group({ x: STAGE_WIDTH - 140, y: 20 });
    this.group.add(this.heartsGroup);
    this.setLives(3);

    // Add Play Button
    this.playButton = this.createPillButton(
      "PLAY",
      STAGE_WIDTH - 150,
      STAGE_HEIGHT - 80,
      130,
      55,
    );
    if (handlePlay) {
      this.playButton.on("click", handlePlay);
    }
    this.group.add(this.playButton);

    // Add Reset Button
    this.resetButton = this.createPillButton(
      "RESET",
      STAGE_WIDTH - 150,
      STAGE_HEIGHT - 80,
      130,
      55,
    );
    if (handleReset) {
      this.resetButton.on("click", handleReset);
    }
    this.resetButton.hide();
    this.group.add(this.resetButton);
  }

  hidePlayButton(): void {
    this.playButton.hide();
  }

  addResetButton(): void {
    this.resetButton.show();
  }

  hideResetButton(): void {
    this.resetButton.hide();
  }

  showPlayButton(): void {
    this.playButton.show();
  }

  setLives(lives: number): void {
    this.heartsGroup.destroyChildren();
    const heartChar = "❤"; // red heart
    for (let i = 0; i < 3; i++) {
      const t = new Konva.Text({
        x: i * 40,
        y: 0,
        text: heartChar,
        fontSize: 28,
        fontFamily: FONT_FAMILY,
        fill: i < lives ? "#ff4d4f" : "#555555",
      });
      this.heartsGroup.add(t);
    }
    this.group.getLayer()?.draw();
  }

  protected createPillButton(
    label: string,
    x: number,
    y: number,
    width: number,
    height: number,
  ): Konva.Group {
    const g = new Konva.Group({ x, y });

    const r = Math.min(height / 2 + 6, 24);
    const rect = new Konva.Rect({
      width,
      height,
      cornerRadius: r,
      fill: COLORS.buttonFill,
      stroke: COLORS.buttonStroke,
      strokeWidth: 4,
      shadowOpacity: 0.15,
      shadowBlur: 8,
    });
    g.add(rect);

    const text = new Konva.Text({
      text: label,
      fontSize: 32,
      fontFamily: FONT_FAMILY,
      fill: COLORS.buttonText,
      width,
      height,
      align: "center",
      verticalAlign: "middle",
    });
    g.add(text);

    return g;
  }

  // Helpers for sliders
  protected valueToX(
    value: number,
    trackX: number,
    trackW: number,
    min: number,
    max: number,
  ): number {
    const t = (value - min) / (max - min);
    return trackX + t * trackW;
  }

  protected xToValue(
    x: number,
    trackX: number,
    trackW: number,
    min: number,
    max: number,
    step: number,
  ): number {
    const t = (x - trackX) / trackW;
    const raw = min + t * (max - min);
    const stepped = Math.round(raw / step) * step;
    return Math.max(min, Math.min(stepped, max));
  }

  getGroup(): Konva.Group {
    return this.group;
  }

  show(): void {
    this.group.show();
  }

  hide(): void {
    this.group.hide();
  }
}
