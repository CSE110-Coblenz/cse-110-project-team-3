import Konva from "konva";
import type { View } from "../../types";
import { STAGE_WIDTH, TOPIC_DEFAULT_STYLES } from "../../constants";
import type { TopicScreenConfig } from "../../types";
import { createKonvaButton } from "../../utils/ui/NavigationButton";
import { BackgroundHelper } from "../../utils/ui/BackgroundHelper";
import { COLORS, FONTS } from "../../constants";

/**
 * Default styles for topic screen elements
 */
const DEFAULT_STYLES = {
  title: {
    fontSize: 48,
    fontFamily: FONTS.topic,
    fill: COLORS.text,
    y: 80,
  },
  description: {
    fontSize: 18,
    fontFamily: FONTS.topic,
    fill: COLORS.text,
    y: 120,
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

  private initializeUI(): void {
    // Background
    const background = BackgroundHelper.createDungeonBackground();
    this.group.add(background);

    // Add torch lights in corners (optional)
    const topLeftTorch = BackgroundHelper.createTorchLight(80, 80);
    const topRightTorch = BackgroundHelper.createTorchLight(
      STAGE_WIDTH - 80,
      80,
    );
    this.group.add(topLeftTorch);
    this.group.add(topRightTorch);

    // Title
    const title = new Konva.Text({
      x: TOPIC_DEFAULT_STYLES.title.x,
      y: TOPIC_DEFAULT_STYLES.title.y,
      text: this.config.title,
      fontSize: TOPIC_DEFAULT_STYLES.title.fontSize,
      fontFamily: TOPIC_DEFAULT_STYLES.title.fontFamily,
      fill: this.config.style?.titleColor || TOPIC_DEFAULT_STYLES.title.fill,
      align: "center",
    });
    title.offsetX(title.width() / 2);
    this.group.add(title);

    // Buttons
    this.config.buttons.forEach((buttonConfig) => {
      const buttonGroup = createKonvaButton(buttonConfig, this.onButtonClick);
      this.group.add(buttonGroup);
    });
    // Description: support either plain string `description` (legacy)
    // or rich `descriptionSegments` (array of { text, bold? }) for inline bolding.
    const maxWidth = STAGE_WIDTH * 0.90; // 90% of stage width
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
