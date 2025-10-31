import Konva from "konva";
import type { View } from "../../types";
import {
  COLORS,
  STAGE_HEIGHT,
  STAGE_WIDTH,
  FONT_FAMILY,
} from "../../constants";

export class RulesScreenView implements View {
  private group: Konva.Group;

  constructor(
    handleExitClick?: () => void
  ) {
    this.group = new Konva.Group();

    // Layout constants to match the mock
    const PAD_X = 56;
    const PAD_TOP = 48;
    const TITLE_SIZE = 72;

    const BULLET_SIZE = 38;   // body text size
    const BULLET_CHAR = "•";
    const BULLET_GAP = 20;    // space between bullet dot and text
    const ITEM_GAP = 28;      // vertical gap between bullet items
    const LINE_HEIGHT = 1.2;

    // width reserved for bullet + gap; body wraps inside remaining width
    const GUTTER = BULLET_SIZE + BULLET_GAP;
    const BODY_WIDTH = STAGE_WIDTH - PAD_X * 2 - GUTTER;

    // Background
    const background = new Konva.Rect({
      x: 0,
      y: 0,
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
      fill: COLORS.bg,
      cornerRadius: 8,
    });
    this.group.add(background);

    // Title: "RULES:"
    const title = new Konva.Text({
        x: PAD_X,
        y: PAD_TOP,
        text: "RULES:",
        fontFamily: FONT_FAMILY,
        fontSize: TITLE_SIZE,
        fill: "#fff",
        fontStyle: "bold",
        listening: false,
      });
      this.group.add(title);

      const addBulletedItem = (text: string, x: number, y: number): Konva.Group => {
        const g = new Konva.Group({ x, y });
  
        const dot = new Konva.Text({
          x: 0,
          y: 0,
          width: BULLET_SIZE,
          text: BULLET_CHAR,
          fontFamily: FONT_FAMILY,
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
          fontFamily: FONT_FAMILY,
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
      bullets.forEach((t, i) => {
        const item = addBulletedItem(t, PAD_X, cursorY);
        this.group.add(item);
  
        const h = item.getClientRect().height;
        cursorY += h + ITEM_GAP;
      });
    
    const BTN_W = 180;
    const BTN_H = 60;
    const exitBtn = this.createPillButton(
      "EXIT",
      (STAGE_WIDTH - BTN_W) / 2,
      STAGE_HEIGHT - 100,
      BTN_W,
      BTN_H
    );
    if (handleExitClick) {
        exitBtn.on("click", handleExitClick);
      }
    this.group.add(exitBtn);
}

  private createPillButton(
    label: string,
    x: number,
    y: number,
    width: number,
    height: number
  ): Konva.Group {
    const g = new Konva.Group({ x, y });

    const r = Math.min(height / 2 + 6, 24);
    const rect = new Konva.Rect({
      width,
      height,
      cornerRadius: r,
      fill: COLORS.buttonFill,
      stroke: COLORS.buttonStroke,
      strokeWidth: 4,
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowBlur: 8,
    });

    const text = new Konva.Text({
      x: 0,
      y: 0,
      width,
      height,
      text: label,
      fill: COLORS.buttonText,
      fontSize: 32,
      fontStyle: "bold",
      align: "center",
      verticalAlign: "middle",
      horizontalAlign: "center",
      fontFamily: FONT_FAMILY,
    });

    g.add(rect, text);

    return g;
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
