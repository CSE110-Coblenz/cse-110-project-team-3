import Konva from "konva";
import {
  COLORS,
  STAGE_HEIGHT,
  STAGE_WIDTH,
  FONT_FAMILY,
} from "../../../constants";
import type { View } from "../../../types";

export class GameOverScreenView implements View {
  private group: Konva.Group;

  constructor(
    level: number,
    handleBackClick?: () => void,
    handleExitClick?: () => void,
  ) {
    this.group = new Konva.Group();

    // Background
    const background = new Konva.Rect({
      x: 0,
      y: 0,
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
      fill: COLORS.bg,
    });
    this.group.add(background);

    // Title Text
    const titleText = new Konva.Text({
      x: STAGE_WIDTH / 2,
      y: STAGE_HEIGHT / 2 - 100,
      text: "You Died!",
      fontSize: 60,
      fontFamily: FONT_FAMILY,
      fill: COLORS.text,
      fontStyle: "bold",
      align: "center",
    });
    titleText.offsetX(titleText.width() / 2);
    this.group.add(titleText);

    // Back to Map Button
    const backButton = this.createPillButton(
      "BACK",
      STAGE_WIDTH / 2 - 96,
      STAGE_HEIGHT - 180,
      192,
      60,
    );
    if (handleBackClick) {
      backButton.on("click", handleBackClick);
    }
    this.group.add(backButton);

    // Exit Button
    const exitButton = this.createPillButton(
      "EXIT",
      STAGE_WIDTH / 2 - 96,
      STAGE_HEIGHT - 100,
      192,
      60,
    );
    if (handleExitClick) {
      exitButton.on("click", handleExitClick);
    }
    this.group.add(exitButton);
  }

  private createPillButton(
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
    });

    const text = new Konva.Text({
      x: 0,
      y: 0,
      width,
      height,
      text: label,
      fill: COLORS.buttonText,
      fontSize: 32,
      fontStyle: "bold",
      align: "center",
      verticalAlign: "middle",
      horizontalAlign: "center",
      fontFamily: FONT_FAMILY,
    });

    g.add(rect, text);

    return g;
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
