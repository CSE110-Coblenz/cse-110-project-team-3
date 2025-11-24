import Konva from "konva";
import type { View } from "../../types";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants";
import type { TopicButton, TopicScreenConfig } from "./types";
import { COLORS, FONT_FAMILY } from "../../constants";

/**
 * Default styles for topic screen elements
 */
const DEFAULT_STYLES = {
  title: {
    fontSize: 48,
    fontFamily: FONT_FAMILY,
    fill: COLORS.text,
    y: 80,
  },
  description: {
    fontSize: 18,
    fontFamily: FONT_FAMILY,
    fill: COLORS.text,
    y: 150,
  },
  button: {
    width: 200,
    height: 60,
    fill: COLORS.buttonFill,
    stroke: COLORS.buttonStroke,
    strokeWidth: 3,
    cornerRadius: 10,
    textFill: COLORS.buttonText,
    fontSize: 24,
  },
};

/**
 * A configurable view for topic-based screens
 */
export class TopicScreenView implements View {
  private group: Konva.Group;
  private config: TopicScreenConfig;
  private onButtonClick: (buttonId: string) => void;

  constructor(
    config: TopicScreenConfig,
    onButtonClick: (buttonId: string) => void,
  ) {
    this.config = config;
    this.onButtonClick = onButtonClick;
    this.group = new Konva.Group({ visible: false });

    this.initializeUI();
  }

  private createButton(button: TopicButton): Konva.Group {
    const buttonGroup = new Konva.Group();

    // Calculate button position
    const buttonWidth = button.style?.width || DEFAULT_STYLES.button.width;
    const buttonHeight = button.style?.height || DEFAULT_STYLES.button.height;

    // Calculate x position
    let xPos = STAGE_WIDTH / 2; // Default center
    if (button.position?.x !== undefined) {
      xPos = button.position.x * STAGE_WIDTH;
    }

    // Calculate y position
    let yPos = DEFAULT_STYLES.description.y + 100;
    if (button.position?.y !== undefined) {
      yPos = button.position.y * window.innerHeight;
    }

    const buttonRect = new Konva.Rect({
      x: xPos - buttonWidth / 2,
      y: yPos,
      width: buttonWidth,
      height: buttonHeight,
      fill: button.style?.fill || DEFAULT_STYLES.button.fill,
      stroke: button.style?.stroke || DEFAULT_STYLES.button.stroke,
      strokeWidth: DEFAULT_STYLES.button.strokeWidth,
      cornerRadius: DEFAULT_STYLES.button.cornerRadius,
    });

    const buttonText = new Konva.Text({
      x: xPos,
      y: yPos + buttonHeight / 2,
      text: button.label,
      fontSize: DEFAULT_STYLES.button.fontSize,
      fontFamily: DEFAULT_STYLES.title.fontFamily,
      fill: button.style?.textFill || DEFAULT_STYLES.button.textFill,
      align: "center",
    });
    buttonText.offsetX(buttonText.width() / 2);
    buttonText.offsetY(buttonText.height() / 2);

    buttonGroup.add(buttonRect);
    buttonGroup.add(buttonText);

    // Add hover effects
    buttonGroup.on("mouseenter", () => {
      document.body.style.cursor = "pointer";
      buttonRect.shadowEnabled(true);
      buttonRect.shadowBlur(10);
      buttonRect.shadowColor("black");
      buttonRect.shadowOpacity(0.3);
      this.group.getLayer()?.draw();
    });

    buttonGroup.on("mouseleave", () => {
      document.body.style.cursor = "default";
      buttonRect.shadowEnabled(false);
      this.group.getLayer()?.draw();
    });

    // Wire up click handler
    buttonGroup.on("click", () => this.onButtonClick(button.id));

    return buttonGroup;
  }

  private initializeUI(): void {
    // Background
    const background = new Konva.Rect({
      x: 0,
      y: 0,
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
      fill: this.config.style?.backgroundColor || "#ffffff",
    });
    this.group.add(background);

    // Title
    const title = new Konva.Text({
      x: STAGE_WIDTH - STAGE_WIDTH / 2,
      y: DEFAULT_STYLES.title.y,
      text: this.config.title,
      fontSize: DEFAULT_STYLES.title.fontSize,
      fontFamily: DEFAULT_STYLES.title.fontFamily,
      fill: this.config.style?.titleColor || DEFAULT_STYLES.title.fill,
      align: "center",
    });
    title.offsetX(title.width() / 2);
    this.group.add(title);

    // Description: support either plain string `description` (legacy)
    // or rich `descriptionSegments` (array of { text, bold? }) for inline bolding.
    const maxWidth = STAGE_WIDTH * 0.8; // 80% of stage width
    const descX = STAGE_WIDTH / 2 - maxWidth / 2;
    const startY = DEFAULT_STYLES.description.y;

    if (
      Array.isArray((this.config as any).descriptionSegments) &&
      (this.config as any).descriptionSegments.length > 0
    ) {
      const segments: Array<{ text: string; bold?: boolean; color?: string }> =
        (this.config as any).descriptionSegments;

      const fontSize = DEFAULT_STYLES.description.fontSize;
      const fontFamily = DEFAULT_STYLES.description.fontFamily;
      const defaultFill =
        this.config.style?.descriptionColor || DEFAULT_STYLES.description.fill;
      const lineHeight = Math.round(fontSize * 1.3);

      let curX = descX;
      let curY = startY;

      // Render segments with basic word-wrapping and inline bold support.
      segments.forEach((segment) => {
        // Respect explicit newlines in the segment text by splitting on '\n'
        const lines = segment.text.split("\n");
        lines.forEach((line, lineIdx) => {
          const words = line.split(" ");
          words.forEach((word, wIdx) => {
            const wordText = word + (wIdx === words.length - 1 ? "" : " ");

            const temp = new Konva.Text({
              text: wordText,
              fontSize,
              fontFamily,
              fontStyle: segment.bold ? "bold" : "normal",
            });

            const wordWidth = temp.width();

            if (curX + wordWidth > descX + maxWidth) {
              // wrap to next line
              curX = descX;
              curY += lineHeight;
            }

            const segmentFill = segment.color || defaultFill;

            const wordNode = new Konva.Text({
              x: curX,
              y: curY,
              text: wordText,
              fontSize,
              fontFamily,
              fontStyle: segment.bold ? "bold" : "normal",
              fill: segmentFill,
              align: "left",
            });
            this.group.add(wordNode);

            curX += wordWidth;
          });

          // After each explicit line in the segment, force line break
          if (lineIdx < lines.length - 1) {
            curX = descX;
            curY += lineHeight;
          }
        });
      });
    } else {
      // Fallback: render the plain description string as before (centered)
      const description = new Konva.Text({
        x: STAGE_WIDTH / 2,
        y: DEFAULT_STYLES.description.y,
        text: this.config.description,
        fontSize: DEFAULT_STYLES.description.fontSize,
        fontFamily: DEFAULT_STYLES.description.fontFamily,
        fill:
          this.config.style?.descriptionColor ||
          DEFAULT_STYLES.description.fill,
        align: "left",
        width: maxWidth,
        wrap: "word",
      });
      description.offsetX(description.width() / 2);
      this.group.add(description);
    }

    // Buttons from config
    this.config.buttons.forEach((buttonConfig) => {
      const buttonGroup = this.createButton(buttonConfig);
      this.group.add(buttonGroup);
    });

    // Exit button (same pill style as ReferenceScreenView)
    const exitBtn = this.createPillButton(
      "EXIT",
      STAGE_WIDTH - 192,
      STAGE_HEIGHT - 96,
      160,
      64,
    );
    exitBtn.on("click", () => this.onButtonClick("exit"));
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

  show(): void {
    this.group.visible(true);
    this.group.getLayer()?.draw();
  }

  hide(): void {
    this.group.visible(false);
    this.group.getLayer()?.draw();
  }

  getGroup(): Konva.Group {
    return this.group;
  }
}
