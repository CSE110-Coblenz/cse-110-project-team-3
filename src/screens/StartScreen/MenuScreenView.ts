import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";

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
        fill: "#000",
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
      fontFamily: "Courier New, monospace",
      fill: "#fff",
    });
    this.group.add(title);

    // Buttons stack
    const centerX = STAGE_WIDTH / 2;
    let startY = 240;

    const startBtn = this.createButton(centerX, startY, "START", handlers.onStart);
    this.group.add(startBtn);
    startY += 56;

    this.resumeBtn = this.createButton(centerX, startY, "RESUME", handlers.onResume);
    this.group.add(this.resumeBtn);
    startY += 56;

    const rulesBtn = this.createButton(centerX, startY, "RULES", handlers.onRules);
    this.group.add(rulesBtn);
    startY += 56;

    const quitBtn = this.createButton(centerX, startY, "QUIT", handlers.onQuit);
    this.group.add(quitBtn);
  }

  /** Generic Konva "button" as a Group (Rect + Text) */
  private createButton(cx: number, y: number, label: string, onClick: () => void): Konva.Group {
    const g = new Konva.Group({ x: cx - 150, y, width: 300, height: 42 });

    const rect = new Konva.Rect({
      width: 300,
      height: 42,
      cornerRadius: 8,
      fill: "#e5e5e5",
      shadowColor: "black",
      shadowBlur: 8,
      shadowOpacity: 0.35,
    });

    const text = new Konva.Text({
      width: 300,
      height: 42,
      align: "center",
      verticalAlign: "middle",
      text: label,
      fontSize: 18,
      fontStyle: "bold",
      fontFamily: "Courier New, monospace",
      fill: "#111",
    });

    // hover + click interactions
    g.on("mouseenter", () => (document.body.style.cursor = "pointer"));
    g.on("mouseleave", () => (document.body.style.cursor = "default"));
    g.on("click", () => {
      if ((g as any)._disabled) return;
      onClick();
    });

    g.add(rect);
    g.add(text);
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
      rect.fill(enabled ? "#e5e5e5" : "#bdbdbd");
      text.fill(enabled ? "#111" : "#555");
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
