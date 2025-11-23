import Konva from "konva";
import { COLORS, STAGE_HEIGHT, STAGE_WIDTH, FONTS } from "../../../constants";
import type { View, NavButton } from "../../../types";
import { createKonvaButton } from "../../../utils/ui/NavigationButton";
import { BackgroundHelper } from "../../../utils/ui/BackgroundHelper";

export class TitleScreenView implements View {
  private group: Konva.Group;

  constructor(
    navigationButtons: NavButton[],
    level: number,
    onButtonClick: (buttonId: string) => void,
  ) {
    this.group = new Konva.Group();

    // Background with tunnel entrance image
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
      y: STAGE_HEIGHT / 2 - 50,
      text: `Mini Game ${level}`,
      fontSize: 60,
      fontFamily: FONTS.dungeon,
      fill: COLORS.text,
      fontStyle: "bold",
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
