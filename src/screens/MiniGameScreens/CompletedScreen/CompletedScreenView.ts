import Konva from "konva";
import { COLORS, STAGE_HEIGHT, STAGE_WIDTH, FONTS } from "../../../constants";
import type { View, NavButton } from "../../../types";
import { createKonvaButton } from "../../../utils/ui/NavigationButton";
import { BackgroundHelper } from "../../../utils/ui/BackgroundHelper";

/**
 * View for the minigame completed screen
 */
export class MinigameCompletedScreenView implements View {
  private group: Konva.Group;

  constructor(
    level: number,
    navigationButtons: NavButton[],
    onButtonClick: (buttonId: string) => void,
  ) {
    this.group = new Konva.Group();

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

    // Title Text
    const titleText = new Konva.Text({
      x: STAGE_WIDTH / 2,
      y: STAGE_HEIGHT / 2 - 100,
      text: `Mini Game ${level}\nCompleted!`,
      fontSize: 60,
      fontFamily: FONTS.dungeon,
      fill: COLORS.text,
      fontStyle: "bold",
      align: "center",
    });
    titleText.offsetX(titleText.width() / 2);
    this.group.add(titleText);

    // Navigation buttons using configuration
    navigationButtons.forEach((buttonConfig) => {
      const buttonGroup = createKonvaButton(buttonConfig, onButtonClick);
      this.group.add(buttonGroup);
    });
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
