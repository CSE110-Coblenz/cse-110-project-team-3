import Konva from "konva";
import type { View } from "../../types";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants";
import type { Button, ScreenConfig } from "../../types";
import { COLORS, FONT_FAMILY } from "../../constants";
import { createKonvaButton } from "../../utils/ui/KonvaButton";

/**
 * Default styles for topic screen elements
 */
const DEFAULT_STYLES = {
  title: {
    fontSize: 48,
    fontFamily: FONT_FAMILY,
    fill: COLORS.text,
    y: 100,
  },
  description: {
    fontSize: 24,
    fontFamily: FONT_FAMILY,
    fill: COLORS.text,
    y: 200,
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
  private config: ScreenConfig;
  private onButtonClick: (buttonId: string) => void;

  constructor(
    config: ScreenConfig,
    onButtonClick: (buttonId: string) => void,
  ) {
    this.config = config;
    this.onButtonClick = onButtonClick;
    this.group = new Konva.Group({ visible: false });

    this.initializeUI();
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

    // Description
    const description = new Konva.Text({
      x: STAGE_WIDTH / 2,
      y: DEFAULT_STYLES.description.y,
      text: this.config.description,
      fontSize: DEFAULT_STYLES.description.fontSize,
      fontFamily: DEFAULT_STYLES.description.fontFamily,
      fill:
        this.config.style?.descriptionColor || DEFAULT_STYLES.description.fill,
      align: "center",
      width: STAGE_WIDTH * 0.8, // 80% of stage width
      wrap: "word",
    });
    description.offsetX(description.width() / 2);
    this.group.add(description);

    // Buttons
    this.config.buttons.forEach((buttonConfig) => {
      const buttonGroup = this.createButton(buttonConfig);
      this.group.add(buttonGroup);
    });
  }

  private createButton(button: Button): Konva.Group {
    // Convert the button config to match the utility's interface
    return createKonvaButton({
      ...button,
      position: {
        ...button.position,
        y: button.position?.y ?? (DEFAULT_STYLES.description.y + 100) / STAGE_HEIGHT
      },
      onClick: this.onButtonClick
    });
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
