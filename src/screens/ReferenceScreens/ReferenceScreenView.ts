import Konva from "konva";
import type { View } from "../../types.ts";
import {
  COLORS,
  STAGE_HEIGHT,
  STAGE_WIDTH,
  FONT_FAMILY,
} from "../../constants";

/*
ReferenceScreenView makes the reference screen view
*/
export class ReferenceScreenView implements View {
  private group: Konva.Group;

  constructor(handleExitClick?: () => void) {
    this.group = new Konva.Group({ visible: true });

    //background
    const background = new Konva.Rect({
      x: 0,
      y: 0,
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
      fill: COLORS.bg,
      cornerRadius: 8,
    });
    this.group.add(background);

    //Title Text
    const titleText = new Konva.Text({
      x: STAGE_WIDTH / 2,
      y: 50,
      text: "References",
      fontSize: 64,
      fontFamily: FONT_FAMILY,
      fill: COLORS.text,
      align: "center",
    });
    titleText.offsetX(titleText.width() / 2);
    this.group.add(titleText);
    // middle text
    const referencesText = new Konva.Text({
      x: STAGE_WIDTH / 2,
      y: STAGE_HEIGHT / 2,
      text: "Force = mass * acceleration\nVelocity = distance / time\nAcceleration = change in velocity / time\nKinetic Energy = 0.5 * mass * velocity^2\nPotential Energy = mass * gravity * height",
      fontSize: 32,
      fontFamily: FONT_FAMILY,
      fill: COLORS.text,
      align: "center",
    });
    referencesText.offsetX(referencesText.width() / 2);
    referencesText.offsetY(referencesText.height() / 2);
    this.group.add(referencesText);

    const exitBtn = this.createPillButton(
      "EXIT",
      STAGE_WIDTH - 192,
      STAGE_HEIGHT - 96,
      160,
      64,
    );

    // Exit button click handler
    if (handleExitClick) {
      exitBtn.on("click", handleExitClick);
    }
    this.group.add(exitBtn);
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
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowBlur: 8,
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

  /*
    Show the screen
    */
  show(): void {
    this.group.visible(true);
    this.group.getLayer()?.draw();
  }

  /*
    Hide the screen
    */
  hide(): void {
    this.group.visible(false);
    this.group.getLayer()?.draw();
  }

  getGroup(): Konva.Group {
    return this.group;
  }
}
