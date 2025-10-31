import Konva from "konva";
import type { View } from "../../types";
import {
  COLORS,
  STAGE_HEIGHT,
  STAGE_WIDTH,
  FONT_FAMILY,
} from "../../constants";

// import { Lev1Force } from "./Lev1Force"; 


export class SimulationScreenView implements View {
  private group: Konva.Group;
  private content: View | null = null;

  constructor(
    currentText: string = "Force",
    handleBackClick?: () => void,
    handleNextClick?: () => void,
  ) {
    this.group = new Konva.Group();

    // Background 
    const background = new Konva.Rect({
      x: 0,
      y: 0,
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
      fill: "black",
    });
    this.group.add(background);

    // Title 
    const title = new Konva.Text({
      text: `SIMULATION: ${currentText}`,
      fontStyle: "bold",
      fontSize: 60,
      fontFamily: FONT_FAMILY,
      fill: "grey",
      x: STAGE_WIDTH / 2,
      y: STAGE_HEIGHT / 2 - 270,
    });
    title.offsetX(title.width() / 2);
    this.group.add(title);

    // simulation
    // this.content = new Lev1Force();
    // this.group.add(this.content.getGroup()); 

    // Bottoni pill identici allo stile della mappa
    const BTN_W = 150;
    const BTN_H = 50;

    const backBtn = this.createPillButton(
      "BACK",
      20,
      STAGE_HEIGHT - BTN_H - 20,
      BTN_W,
      BTN_H,
    );
    const nextBtn = this.createPillButton(
      "NEXT",
      STAGE_WIDTH - BTN_W- 20,
      STAGE_HEIGHT - BTN_H - 20,
      BTN_W,
      BTN_H,
    );

    if (handleBackClick) backBtn.on("click", handleBackClick);
    if (handleNextClick) nextBtn.on("click", handleNextClick);

    this.group.add(backBtn, nextBtn);
  }

  // Button from Andrew class
  private createPillButton(
    label: string,
    x: number,
    y: number,
    width: number,
    height: number,
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

