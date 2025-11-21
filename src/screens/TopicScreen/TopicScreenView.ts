import Konva from "konva";
import type { View } from "../../types";
import { STAGE_WIDTH, TOPIC_DEFAULT_STYLES } from "../../constants";
import type { TopicScreenConfig } from "../../types";
import { createKonvaButton } from "../../utils/ui/NavigationButton";
import { BackgroundHelper } from "../../utils/ui/BackgroundHelper";

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
    const topRightTorch = BackgroundHelper.createTorchLight(STAGE_WIDTH - 80, 80);
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

    // Description
    const description = new Konva.Text({
      x: TOPIC_DEFAULT_STYLES.description.x,
      y: TOPIC_DEFAULT_STYLES.description.y,
      text: this.config.description,
      fontSize: TOPIC_DEFAULT_STYLES.description.fontSize,
      fontFamily: TOPIC_DEFAULT_STYLES.description.fontFamily,
      fill:
        this.config.style?.descriptionColor || TOPIC_DEFAULT_STYLES.description.fill,
      align: "center",
      width: STAGE_WIDTH * 0.8, // 80% of stage width
      wrap: "word",
    });
    description.offsetX(description.width() / 2);
    this.group.add(description);

    // Buttons
    this.config.buttons.forEach((buttonConfig) => {
      const buttonGroup = createKonvaButton(buttonConfig, this.onButtonClick);
      this.group.add(buttonGroup);
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
