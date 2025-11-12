import Konva from "konva";
import type { RuleConfig, View } from "../../../types";
import {
  COLORS,
  STAGE_HEIGHT,
  STAGE_WIDTH,
  FONT_FAMILY,
} from "../../../constants";

export class MiniGameRuleScreenView implements View {
  private group: Konva.Group;

  constructor(
    rulesConfig: RuleConfig,
    handleNextClick?: () => void,
    handleBackClick?: () => void
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
      y: 50,
      text: "Mini Game Rules",
      fontSize: 60,
      fontFamily: FONT_FAMILY,
      fill: COLORS.text,
      fontStyle: "bold",
    });
    titleText.offsetX(titleText.width() / 2);
    this.group.add(titleText);

    // Rules Text
    const rulesText = new Konva.Text({
      x: 60,
      y: 150,
      width: STAGE_WIDTH - 100,
      text: rulesConfig.rules
        .map((rule, index) => `${index + 1}. ${rule}`)
        .join("\n\n"),
      fontSize: 32,
      fontFamily: FONT_FAMILY,
      fill: COLORS.text,
    });
    this.group.add(rulesText);

    // Next Button
    const nextButton = this.createPillButton(
      "NEXT",
      STAGE_WIDTH - 192,
      STAGE_HEIGHT - 96,
      160,
      64
    );
    nextButton.on("mouseenter", function (e) {
      const stage = e.target.getStage();
      if (stage) {
        stage.container().style.cursor = "pointer";
      }
    });
    nextButton.on("mouseleave", function (e) {
      const stage = e.target.getStage();
      if (stage) {
        stage.container().style.cursor = "default";
      }
    });
    if (handleNextClick) {
      nextButton.on("click", handleNextClick);
    }
    this.group.add(nextButton);

    // Back Button
    const backButton = this.createPillButton(
      "BACK",
      32,
      STAGE_HEIGHT - 96,
      160,
      64
    );
    backButton.on("mouseenter", function (e) {
      const stage = e.target.getStage();
      if (stage) {
        stage.container().style.cursor = "pointer";
      }
    });
    backButton.on("mouseleave", function (e) {
      const stage = e.target.getStage();
      if (stage) {
        stage.container().style.cursor = "default";
      }
    });
    if (handleBackClick) {
      backButton.on("click", handleBackClick);
    }
    this.group.add(backButton);
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
