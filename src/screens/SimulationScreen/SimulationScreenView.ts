import Konva from "konva";
import type { View } from "../../types";
import {
  COLORS,
  STAGE_HEIGHT,
  STAGE_WIDTH,
  FONT_FAMILY,
} from "../../constants";
import { Lev1Force, Lev1text } from "./Lev1Force";

type OptionKey = "A" | "B" | "C";

export class SimulationScreenView implements View {
  private group: Konva.Group;
  private content: View | null = null;

  private nextBtn!: Konva.Group;
  private optionA!: Konva.Group;
  private optionB!: Konva.Group;
  private optionC!: Konva.Group;

  constructor(
    currentText: string = "Force",
    handleBackClick?: () => void,
    handleNextClick?: () => void,
    handleOptionClick?: (which: OptionKey, node: Konva.Group) => void,
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
      fontSize: 40,
      fontFamily: FONT_FAMILY,
      fill: "white",
      x: STAGE_WIDTH / 2,
      y: 16,
    });
    title.offsetX(title.width() / 2);
    this.group.add(title);

    // Problem statement
    const questionText = new Konva.Text({
      x: 24,
      y: 75,
      width: STAGE_WIDTH - 48,
      text: Lev1text,
      fontFamily: FONT_FAMILY,
      fontSize: 18,
      lineHeight: 1.2,
      fill: "white",
      listening: false,
    });
    this.group.add(questionText);

    // Layout
    const RIGHT_PANEL_W = 300;
    const RIGHT_PANEL_PAD = 16;
    const VIDEO_TOP = 200;   // lowered so it never covers the statement
    const VIDEO_BOTTOM = 120; // space for nav buttons

    // Video view
    const lev1 = new Lev1Force({
      topOffset: VIDEO_TOP,
      bottomOffset: VIDEO_BOTTOM,
      leftOffset: 24,
      rightOffset: RIGHT_PANEL_W + 24,
    });
    this.group.add(lev1.getGroup());
    this.content = lev1;

    // Nav buttons
    const NAV_W = 150;
    const NAV_H = 50;

    const backBtn = this.createPillButton(
      "BACK",
      20,
      STAGE_HEIGHT - NAV_H - 20,
      NAV_W,
      NAV_H,
      28,
    );
    this.nextBtn = this.createPillButton(
      "NEXT",
      STAGE_WIDTH - NAV_W - 20,
      STAGE_HEIGHT - NAV_H - 20,
      NAV_W,
      NAV_H,
      28,
    );
    if (handleBackClick) backBtn.on("click", handleBackClick);
    if (handleNextClick) this.nextBtn.on("click", handleNextClick);
    this.group.add(backBtn, this.nextBtn);

    // Disable NEXT by default 
    this.setNextEnabled(false);

    // Options 
    const OPT_W = RIGHT_PANEL_W - 2 * RIGHT_PANEL_PAD;
    const OPT_H = 50;
    const OPT_X = STAGE_WIDTH - RIGHT_PANEL_W + RIGHT_PANEL_PAD;
    const OPT_Y0 = VIDEO_TOP + 40;

    this.optionA = this.createPillButton(
      "A) 18.8 m/s",
      OPT_X,
      OPT_Y0 + 0 * (OPT_H + 14),
      OPT_W,
      OPT_H,
      22,
    );
    this.optionB = this.createPillButton(
      "B) 19.8 m/s",
      OPT_X,
      OPT_Y0 + 1 * (OPT_H + 14),
      OPT_W,
      OPT_H,
      22,
    );
    this.optionC = this.createPillButton(
      "C) 19.5 m/s",
      OPT_X,
      OPT_Y0 + 2 * (OPT_H + 14),
      OPT_W,
      OPT_H,
      22,
    );

    if (handleOptionClick) {
      this.optionA.on("click", () => handleOptionClick("A", this.optionA));
      this.optionB.on("click", () => handleOptionClick("B", this.optionB));
      this.optionC.on("click", () => handleOptionClick("C", this.optionC));
    }
    this.group.add(this.optionA, this.optionB, this.optionC);

    this.group.getLayer()?.draw();
  }

  // Pill button with configurable size and font
  private createPillButton(
    label: string,
    x: number,
    y: number,
    width: number,
    height: number,
    fontSize: number = 32,
  ): Konva.Group {
    const g = new Konva.Group({ x, y });

    const baseFill = COLORS.buttonFill;
    const r = Math.min(height / 2 + 6, 24);
    const rect = new Konva.Rect({
      width,
      height,
      cornerRadius: r,
      fill: baseFill,
      stroke: COLORS.buttonStroke,
      strokeWidth: 4,
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowBlur: 8,
    });
    rect.setAttr("baseFill", baseFill);

    const text = new Konva.Text({
      x: 0,
      y: 0,
      width,
      height,
      text: label,
      fill: COLORS.buttonText,
      fontSize,
      fontStyle: "bold",
      align: "center",
      verticalAlign: "middle",
      horizontalAlign: "center",
      fontFamily: FONT_FAMILY,
    });

    g.on("mouseenter", () => {
      if (g.getAttr("disabled") || g.getAttr("locked")) 
        return;
      document.body.style.cursor = "pointer";
      rect.fill("white");
      g.getLayer()?.batchDraw();
    });

    g.on("mouseleave", () => {
      if (g.getAttr("disabled") || g.getAttr("locked")) 
        return;
      document.body.style.cursor = "default";
      rect.fill(baseFill);
      g.getLayer()?.batchDraw();
    });

    g.add(rect, text);
    return g;
  }

  // Enable/disable NEXT 
  public setNextEnabled(enabled: boolean): void {
    this.nextBtn.setAttr("disabled", !enabled);
    this.nextBtn.opacity(enabled ? 1 : 0.5);
    this.nextBtn.listening(enabled);
    this.nextBtn.getLayer()?.batchDraw();
  }

  // Getters the controller uses
  public getOption(key: OptionKey): Konva.Group {
    if (key === "A") {
      return this.optionA;
    } else if (key === "B") {
      return this.optionB;
    } else {
      return this.optionC;
    }
  }
  public getAllOptions(): Konva.Group[] {
    return [this.optionA, this.optionB, this.optionC];
  }

  getGroup(): Konva.Group {
    return this.group;
  }

  show(): void {
    this.group.visible(true);
    this.content?.show?.();
    this.group.getLayer()?.draw();
  }

  hide(): void {
    this.group.visible(false);
    this.content?.hide?.();
    this.group.getLayer()?.draw();
  }
}
