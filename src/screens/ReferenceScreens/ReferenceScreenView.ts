import Konva from "konva";
import type { View, NavButton } from "../../types.ts";
import {
  COLORS,
  STAGE_HEIGHT,
  STAGE_WIDTH,
  FONT_FAMILY,
} from "../../constants";
import { createKonvaButton } from "../../utils/ui/NavigationButton.ts";
import { ReferenceScreenNavigationButtons } from "../../configs/NavigationButtons/Reference.ts";

/*
ReferenceScreenView makes the reference screen view
*/
export class ReferenceScreenView implements View {
  private group: Konva.Group;

  constructor(handleButtonClick?: (buttonId: string) => void) {
    this.group = new Konva.Group({ visible: true });

    //background
    const background = new Konva.Rect({
      x: 0,
      y: 0,
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
      fill: COLORS.bg,
      cornerRadius: 8,
    });
    this.group.add(background);

    //Title Text
    const titleText = new Konva.Text({
      x: STAGE_WIDTH / 2,
      y: 50,
      text: "References",
      fontSize: 64,
      fontFamily: FONT_FAMILY,
      fill: COLORS.text,
      align: "center",
    });
    titleText.offsetX(titleText.width() / 2);
    this.group.add(titleText);

    // middle text
    const referencesText = new Konva.Text({
      x: STAGE_WIDTH / 2,
      y: STAGE_HEIGHT / 2,
      text: "Forces: \n Sum of Forces = total mass * acceleration\nProjectile Motion: \nx = v_0x * t\n y = v_0y * t - 0.5 * g * t^2\nFriction: \n f_friction = μ * N",
      fontSize: 32,
      fontFamily: FONT_FAMILY,
      fill: COLORS.text,
      align: "center",
    });
    referencesText.offsetX(referencesText.width() / 2);
    referencesText.offsetY(referencesText.height() / 2);
    this.group.add(referencesText);

    // Create navigation buttons from configuration
    if (handleButtonClick) {
      ReferenceScreenNavigationButtons.forEach((buttonConfig: NavButton) => {
        const button = createKonvaButton(buttonConfig, handleButtonClick);
        this.group.add(button);
      });
    }
  }

  /*
    Show the screen
    */
  show(): void {
    this.group.visible(true);
    this.group.getLayer()?.draw();
  }

  /*
    Hide the screen
    */
  hide(): void {
    this.group.visible(false);
    this.group.getLayer()?.draw();
  }

  getGroup(): Konva.Group {
    return this.group;
  }
}