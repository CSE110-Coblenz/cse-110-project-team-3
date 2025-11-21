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
    fontSize: 20,
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
      align: "left",
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
