import Konva from "konva";
import type { View } from "../../types.ts";
import {
  COLORS,
  STAGE_WIDTH,
  STAGE_HEIGHT,
  FONT_FAMILY,
} from "../../constants.ts";

/**
 * MenuScreenView - Konva rendering for the welcome screen
 */
export class MenuScreenView implements View {
  private group: Konva.Group;

  private resumeBtn?: Konva.Group;
  private resumeEnabled = false;

  constructor(handlers: {
    onStart: () => void;
    onResume: () => void;
    onRules: () => void;
    onQuit: () => void;
  }) {
    this.group = new Konva.Group({ visible: false });

    // Background
    this.group.add(
      new Konva.Rect({
        x: 0,
        y: 0,
        width: STAGE_WIDTH,
        height: STAGE_HEIGHT,
        fill: COLORS.bg,
        cornerRadius: 8,
      })
    );

    // Title
    const title = new Konva.Text({
      x: 0,
      y: 90,
      width: STAGE_WIDTH,
      align: "center",
      text: "WELCOME\nTO THE GAME!!!",
      fontSize: 48,
      fontStyle: "bold",
      fontFamily: FONT_FAMILY,
      fill: COLORS.text,
      listening: false,
    });
    this.group.add(title);

    // Buttons stack
    const centerX = STAGE_WIDTH / 2;
    const buttonWidth = 300;
    const buttonHeight = 64;
    let startY = 240;

    const startBtn = this.createPillButton(
      "START",
      centerX - buttonWidth / 2,
      startY,
      buttonWidth,
      buttonHeight,
      handlers.onStart
    );
    this.group.add(startBtn);
    startY += 80;

    this.resumeBtn = this.createPillButton(
      "RESUME",
      centerX - buttonWidth / 2,
      startY,
      buttonWidth,
      buttonHeight,
      handlers.onResume
    );
    this.group.add(this.resumeBtn);
    startY += 80;

    const rulesBtn = this.createPillButton(
      "RULES",
      centerX - buttonWidth / 2,
      startY,
      buttonWidth,
      buttonHeight,
      handlers.onRules
    );
    this.group.add(rulesBtn);
    startY += 80;

    const quitBtn = this.createPillButton(
      "QUIT",
      centerX - buttonWidth / 2,
      startY,
      buttonWidth,
      buttonHeight,
      handlers.onQuit
    );
    this.group.add(quitBtn);
  }

  /** Create a pill-shaped button matching the style of other screens */
  private createPillButton(
    label: string,
    x: number,
    y: number,
    width: number,
    height: number,
    onClick?: () => void
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

    // hover + click interactions
    if (onClick) {
      g.on("mouseenter", () => (document.body.style.cursor = "pointer"));
      g.on("mouseleave", () => (document.body.style.cursor = "default"));
      g.on("click", () => {
        if ((g as any)._disabled) return;
        onClick();
      });
    }

    g.add(rect, text);
    return g;
  }

  /** Enable/disable visual state for Resume */
  setResumeEnabled(enabled: boolean) {
    this.resumeEnabled = enabled;
    if (!this.resumeBtn) return;

    (this.resumeBtn as any)._disabled = !enabled;

    // Tint when disabled
    const rect = this.resumeBtn.findOne<Konva.Rect>("Rect");
    const text = this.resumeBtn.findOne<Konva.Text>("Text");
    if (rect && text) {
      rect.fill(enabled ? COLORS.buttonFill : "#bdbdbd");
      text.fill(enabled ? COLORS.buttonText : "#555");
    }
    this.group.getLayer()?.draw();
  }

  show(): void {
    this.group.visible(true);
    this.group.getLayer()?.draw();
  }

  hide(): void {
    this.group.visible(false);
    this.group.getLayer()?.draw();
  }

  getGroup(): Konva.Group {
    return this.group;
  }
}
