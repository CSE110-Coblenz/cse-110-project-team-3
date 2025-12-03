import Konva from "konva";
import type { View, NavButton } from "../../types";
import { COLORS, STAGE_WIDTH, FONTS } from "../../constants";
import { createKonvaButton } from "../../utils/ui/NavigationButton.ts";
import { BackgroundHelper } from "../../utils/ui/BackgroundHelper.ts";
import { RulesScreenNavigationButtons } from "../../configs/NavigationButtons/Rules.ts";

/**
 * View for the rules screen
 */
export class RulesScreenView implements View {
  private group: Konva.Group;

  constructor(handleButtonClick?: (buttonId: string) => void) {
    this.group = new Konva.Group();

    // Layout constants to match the mock
    const PAD_X = 56;
    const PAD_TOP = 48;
    const TITLE_SIZE = 72;

    const BULLET_SIZE = 38; // body text size
    const BULLET_CHAR = "•";
    const BULLET_GAP = 20; // space between bullet dot and text
    const ITEM_GAP = 28; // vertical gap between bullet items
    const LINE_HEIGHT = 1.2;

    // width reserved for bullet + gap; body wraps inside remaining width
    const GUTTER = BULLET_SIZE + BULLET_GAP;
    const BODY_WIDTH = STAGE_WIDTH - PAD_X * 2 - GUTTER;

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

    // Title: "RULES:"
    const title = new Konva.Text({
      x: PAD_X,
      y: PAD_TOP,
      text: "RULES:",
      fontFamily: FONTS.dungeon,
      fontSize: TITLE_SIZE,
      fill: COLORS.text,
      fontStyle: "bold",
      listening: false,
    });
    this.group.add(title);

    const addBulletedItem = (
      text: string,
      x: number,
      y: number,
    ): Konva.Group => {
      const g = new Konva.Group({ x, y });

      const dot = new Konva.Text({
        x: 0,
        y: 0,
        width: BULLET_SIZE,
        text: BULLET_CHAR,
        fontFamily: FONTS.physics,
        fontSize: BULLET_SIZE,
        fill: COLORS.text,
        align: "left",
        listening: false,
      });

      const body = new Konva.Text({
        x: GUTTER,
        y: 0,
        width: BODY_WIDTH,
        text,
        wrap: "word",
        lineHeight: LINE_HEIGHT,
        fontFamily: FONTS.physics,
        fontSize: BULLET_SIZE,
        fill: COLORS.text,
        align: "left",
        listening: false,
      });

      g.add(dot, body);
      return g;
    };

    const bullets = [
      "Complete each stage to learn the basics of physics.",
      "At the end, complete each mini game to accomplish the stage.",
    ];

    let cursorY = title.y() + TITLE_SIZE + 36; // space under title
    bullets.forEach((t) => {
      const item = addBulletedItem(t, PAD_X, cursorY);
      this.group.add(item);

      const h = item.getClientRect().height;
      cursorY += h + ITEM_GAP;
    });

    // Create navigation buttons from configuration
    if (handleButtonClick) {
      RulesScreenNavigationButtons.forEach((buttonConfig: NavButton) => {
        const button = createKonvaButton(buttonConfig, handleButtonClick);
        this.group.add(button);
      });
    }
  }

  getGroup(): Konva.Group {
    return this.group;
  }

  show(): void {
    this.group.visible(true);
    this.group.getLayer()?.draw();
  }

  hide(): void {
    this.group.visible(false);
    this.group.getLayer()?.draw();
  }
}
