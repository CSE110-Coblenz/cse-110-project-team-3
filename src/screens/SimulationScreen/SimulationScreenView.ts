import Konva from "konva";
import type { View } from "../../types";
import {
  COLORS,
  STAGE_HEIGHT,
  STAGE_WIDTH,
  FONT_FAMILY,
} from "../../constants";
import { Lev1 } from "./Lev1";
import { Lev2 } from "./Lev2";

export class SimulationScreenView implements View {
  private group: Konva.Group;
  private content: View;
  private nextBtn: Konva.Group;
  private backBtn: Konva.Group;

  constructor(
    level: "lev1" | "lev2",
    handleBackClick?: () => void,
    handleNextClick?: () => void,
  ) {
    this.group = new Konva.Group();

    // Current content
    if (level === "lev2") {
      this.content = new Lev2(undefined, (enable) =>
        this.setNextEnabled(enable),
      );
    } else {
      this.content = new Lev1(); // Lev1 remains exactly as provided
    }

    this.group.add(this.content.getGroup());

    // Navigation buttons
    const NAV_W = 150;
    const NAV_H = 50;

    this.backBtn = this.createPillButton(
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

    // NEXT starts disabled until the user answers correctly
    this.setNextEnabled(false);

    if (handleBackClick) this.backBtn.on("click", handleBackClick);
    if (handleNextClick)
      this.nextBtn.on("click", () => {
        // Prevent clicks if button is disabled
        if (this.nextBtn.getAttr("disabled")) return;
        handleNextClick();
      });

    this.group.add(this.backBtn, this.nextBtn);
  }

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
    const rect = new Konva.Rect({
      width,
      height,
      cornerRadius: Math.min(height / 2 + 6, 24),
      fill: baseFill,
      stroke: COLORS.buttonStroke,
      strokeWidth: 4,
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowBlur: 8,
    });

    const text = new Konva.Text({
      width,
      height,
      text: label,
      fill: COLORS.buttonText,
      fontSize,
      fontStyle: "bold",
      align: "center",
      verticalAlign: "middle",
      fontFamily: FONT_FAMILY,
    });

    // hover come da tua richiesta
    g.on("mouseenter", () => {
      if (g.getAttr("disabled") || g.getAttr("locked")) return;
      document.body.style.cursor = "pointer";
      rect.fill("white");
      g.getLayer()?.batchDraw();
    });

    g.on("mouseleave", () => {
      if (g.getAttr("disabled") || g.getAttr("locked")) return;
      document.body.style.cursor = "default";
      rect.fill(baseFill);
      g.getLayer()?.batchDraw();
    });

    g.add(rect, text);
    return g;
  }

  // Called by Lev2 when the correct answer is selected.
  public setNextEnabled(enabled: boolean): void {
    this.nextBtn.setAttr("disabled", !enabled);
    this.nextBtn.opacity(enabled ? 1 : 0.5);
    this.nextBtn.listening(enabled);
    this.nextBtn.getLayer()?.batchDraw();
  }

  getGroup(): Konva.Group {
    return this.group;
  }

  show(): void {
    this.group.visible(true);
    this.content.show();
    this.group.getLayer()?.draw();
  }

  hide(): void {
    this.group.visible(false);
    this.content.hide();
    this.group.getLayer()?.draw();
  }
}
