import Konva from "konva";
import type { View, NavButton } from "../../types.ts";
import { COLORS, STAGE_HEIGHT, STAGE_WIDTH, FONTS } from "../../constants";
import { createKonvaButton } from "../../utils/ui/NavigationButton.ts";
import { BackgroundHelper } from "../../utils/ui/BackgroundHelper.ts";
import { ReferenceScreenNavigationButtons } from "../../configs/NavigationButtons/Reference.ts";

/**
 * ReferenceScreenView makes the reference screen view
 */
export class ReferenceScreenView implements View {
  private group: Konva.Group;

  constructor(handleButtonClick?: (buttonId: string) => void) {
    this.group = new Konva.Group({ visible: true });

    this.group = new Konva.Group({ visible: false });

    // Add dungeon background
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

    //Title Text
    const titleText = new Konva.Text({
      x: STAGE_WIDTH / 2,
      y: 50,
      text: "References",
      fontSize: 64,
      fontFamily: FONTS.dungeon,
      fill: COLORS.text,
      align: "center",
    });
    titleText.offsetX(titleText.width() / 2);
    this.group.add(titleText);

    // middle text
    const referencesText = new Konva.Text({
      x: STAGE_WIDTH / 2,
      y: STAGE_HEIGHT / 2 + 65,
      text: `      Projectile Motion:
      vₓ = v · cos(θ)
      vᵧ = v · sin(θ)
      vᵧ = vᵧ₀ + g·t
      0 = v * sin(θ) + gt
      v * sin(θ) / g = t
      y = y₀ + v₀·sin(θ)·t + ½ g t²
      x = v₀ * cos(0) * t
      R = v₀² * sin(2θ) / g

      Friction:
      fₖ = μₖN
      F = m · a
      N = mg.
      fₛ ≤ μₛN.
      `,
      fontSize: 24,
      fontFamily: FONTS.topic,
      fill: COLORS.text,
      align: "left",
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
