import type { Group } from "konva/lib/Group";
import { COLORS, FONTS, STAGE_HEIGHT, STAGE_WIDTH } from "./constants";
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
  | { type: "login"; nextScreen?: Screen }
  | { type: "menu" }
  | { type: "rules"; returnTo?: Screen }
  | { type: "level" }
  | { type: "map"; mapId?: number }
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
      if (this.level === 1) {
        // game1 completed -> unlock lev-4
        setCurrentLevelIndex(4);
      } else if (this.level === 2) {
        //  game2 completed
        setCurrentLevelIndex(8);
      }
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
        fontFamily: FONTS.dungeon,
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

    // Create pill-shaped button rectangle with shadow (stone tablet base)
    const rect = new Konva.Rect({
      width,
      height,
      cornerRadius: r,
      fill: COLORS.buttonFill,
      stroke: COLORS.buttonStroke,
      strokeWidth: 4,
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowBlur: 8,
    });
    g.add(rect);

    // Chiseled edge highlight (inner highlight for 3D carved stone effect)
    const chiselHighlight = new Konva.Rect({
      x: 2,
      y: 2,
      width: width - 4,
      height: height - 4,
      stroke: COLORS.stoneLight,
      strokeWidth: 2,
      cornerRadius: r - 2,
      opacity: 0.3,
      listening: false,
    });
    g.add(chiselHighlight);

    // Create button text with centered alignment (carved text effect)
    const text = new Konva.Text({
      text: label,
      fontSize: 32,
      fontFamily: FONTS.physics,
      fontStyle: "bold",
      fill: COLORS.buttonText,
      width,
      height,
      align: "center",
      verticalAlign: "middle",
      shadowColor: COLORS.black,
      shadowBlur: 2,
      shadowOpacity: 0.8,
      shadowOffsetY: 2, // Engraved text effect
    });
    g.add(text);

    // Add hover effects - stone tablet glows like torchlight
    g.on("mouseenter", () => {
      if (g.getAttr("disabled") || g.getAttr("locked")) return;
      document.body.style.cursor = "pointer";
      rect.fill(COLORS.buttonHover); // Lit stone
      rect.shadowBlur(16); // Stronger glow
      text.fill(COLORS.textHighlight); // Torch yellow glow
      g.getLayer()?.batchDraw();
    });

    g.on("mouseleave", () => {
      if (g.getAttr("disabled") || g.getAttr("locked")) return;
      document.body.style.cursor = "default";
      rect.fill(COLORS.buttonFill); // Return to stone tablet
      rect.shadowBlur(8); // Normal shadow
      text.fill(COLORS.buttonText); // Return to normal text
      g.getLayer()?.batchDraw();
    });

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
export interface NavButton {
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
 * Map node configuration for dungeon map
 * - id: Unique identifier for the node
 * - label: Text displayed on the node
 * - target: Screen to navigate to when the node is clicked
 * - position: Position of the node on the map
 * - isBoss: Whether the node is a boss room (default: false)
 * - style: Optional styling for the node
 */
export interface MapNode {
  id: string;
  label: string;
  target: Screen;
  position: {
    x: number; // Absolute x position on the map
    y: number; // Absolute y position on the map
  };
  isBoss?: boolean;
  style?: {
    width?: number;
    height?: number;
    fill?: string;
    stroke?: string;
    textFill?: string;
  };
  unlockIndex?: number; // to unblock nodes
}

/**
 * Arrow connection between map nodes
 */
export interface MapArrow {
  from: string; // ID of the source node
  to: string; // ID of the destination node
}

export interface TopicScreenConfig {
  title: string;
  description?: string;
  /**
   * Optional richer description made of text segments.
   * Each segment can enable `bold` to indicate this phrase should be rendered bold.
   * If present, `descriptionSegments` will be used in preference to `description`.
   */
  descriptionSegments?: Array<{ text: string; bold?: boolean; color?: string }>;
  buttons: NavButton[];
  style?: {
    titleColor: string;
    descriptionColor: string;
    backgroundColor: string;
  };
}

/**
 * Configuration for a map screen
 * - nodes: Array of map nodes (dungeon rooms) to display
 * - arrows: Array of arrows connecting nodes
 * - buttons: Array of navigation buttons on the screen
 * - style: Optional styling for the screen
 */
export interface MapScreenConfig {
  nodes: MapNode[];
  arrows: MapArrow[];
  buttons: NavButton[];
  style?: {
    backgroundColor?: string;
  };
}

// global progress value
export let currentLevelIndex = 0;

// upgrade to the current max level reached by the player
export function setCurrentLevelIndex(newIndex: number): void {
  if (newIndex > currentLevelIndex) {
    currentLevelIndex = newIndex;
  }
}
