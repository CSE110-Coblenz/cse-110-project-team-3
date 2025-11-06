import Konva from "konva";
import type { View } from "../../types";
import {
  COLORS,
  SIMULATION_CONSTANTS,
  STAGE_HEIGHT,
  STAGE_WIDTH,
  FONT_FAMILY,
} from "../../constants";

export class MinigameSimulView implements View {
  private group: Konva.Group;
  private projectile: Konva.Circle;

  constructor(handlePlay?: () => void, distanceX: number = 0) {
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

    // Line to indicate the ground
    const groundLine = new Konva.Line({
      points: [
        0,
        SIMULATION_CONSTANTS.ground_level,
        STAGE_WIDTH,
        SIMULATION_CONSTANTS.ground_level,
      ],
      stroke: COLORS.ground,
      strokeWidth: 4,
    });
    this.group.add(groundLine);

    // Add cannon image
    Konva.Image.fromURL("/cannon.png", (image) => {
      image.width(150);
      image.height(150);
      image.x(75);
      image.y(STAGE_HEIGHT - 300);
      this.group.add(image);
    });

    // Add Target
    Konva.Image.fromURL("/target.png", (image) => {
      image.width(30);
      image.height(30);
      image.x(150 + distanceX - 15); // Cannon x + distanceX - half target width
      image.y(SIMULATION_CONSTANTS.ground_level - 15); // add an offset to match the ground level
      this.group.add(image);
    });

    // Projectile
    this.projectile = new Konva.Circle({
      x: 150, // Starting x position
      y: SIMULATION_CONSTANTS.ground_level,
      radius: 10,
      fill: COLORS.nodeStroke,
    });
    this.group.add(this.projectile);
    this.projectile.hide();

    // Add Play Button
    const playButton = this.createPillButton(
      "PLAY",
      STAGE_WIDTH - 150,
      STAGE_HEIGHT - 80,
      130,
      55
    );
    if (handlePlay) {
      playButton.on("click", handlePlay);
    }
    this.group.add(playButton);
  }

  private createPillButton(
    label: string,
    x: number,
    y: number,
    width: number,
    height: number
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

  getProjectile(): Konva.Circle {
    return this.projectile;
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
