import Konva from "konva";
import type { RuleConfig, NavButton } from "../../../types";
import { COLORS, STAGE_WIDTH, FONTS } from "../../../constants";
import type { View } from "../../../types";
import { createKonvaButton } from "../../../utils/ui/NavigationButton";
import { BackgroundHelper } from "../../../utils/ui/BackgroundHelper";

export class MiniGameRuleScreenView implements View {
  private group: Konva.Group;

  constructor(
    rulesConfig: RuleConfig,
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
      y: 50,
      text: "Mini Game Rules",
      fontSize: 60,
      fontFamily: FONTS.dungeon,
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
      fontFamily: FONTS.physics,
      fill: COLORS.text,
    });
    this.group.add(rulesText);

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
