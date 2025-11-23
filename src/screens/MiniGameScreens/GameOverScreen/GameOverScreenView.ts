import Konva from "konva";
import { COLORS, STAGE_HEIGHT, STAGE_WIDTH, FONTS } from "../../../constants";
import type { View, NavButton } from "../../../types";
import { createKonvaButton } from "../../../utils/ui/NavigationButton";

export class GameOverScreenView implements View {
  private group: Konva.Group;

  constructor(
    _level: number,
    navigationButtons: NavButton[],
    onButtonClick: (buttonId: string) => void,
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
      y: STAGE_HEIGHT / 2 - 100,
      text: "You Died!",
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
