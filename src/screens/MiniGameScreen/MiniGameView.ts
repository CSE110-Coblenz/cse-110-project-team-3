import Konva from "konva";
import type { View } from "../../types";
import {
  COLORS,
  FONT_FAMILY,
  STAGE_HEIGHT,
  STAGE_WIDTH,
} from "../../constants";
import type { MiniGameQuestion, OptionIndex } from "./MiniGameModel";

type OptionHandler = (index: OptionIndex, node: Konva.Group) => void;

export class MiniGameView implements View {
  private group: Konva.Group;

  private title!: Konva.Text;
  private livesText!: Konva.Text;
  private questionText!: Konva.Text;

  private optionGroups: Konva.Group[] = [];
  private nextBtn!: Konva.Group;

  constructor(
    onBackClick?: () => void,
    onNextClick?: () => void,
    onOptionClick?: OptionHandler,
  ) {
    this.group = new Konva.Group({ visible: false });

    // Background
    const background = new Konva.Rect({
      x: 0,
      y: 0,
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
      fill: COLORS.black,
    });
    this.group.add(background);

    // Title
    this.title = new Konva.Text({
      text: "MINIGAME",
      fontStyle: "bold",
      fontSize: 40,
      fontFamily: FONT_FAMILY,
      fill: COLORS.text,
      x: STAGE_WIDTH / 2,
      y: 16,
      align: "center",
    });
    this.title.offsetX(this.title.width() / 2);
    this.group.add(this.title);

    // Lives (top-right)
    this.livesText = new Konva.Text({
      text: "Lives: 2",
      fontSize: 20,
      fontFamily: FONT_FAMILY,
      fill: COLORS.text,
      x: STAGE_WIDTH - 20,
      y: 20,
      align: "right",
    });
    this.livesText.offsetX(this.livesText.width());
    this.group.add(this.livesText);

    // Question prompt
    this.questionText = new Konva.Text({
      x: 24,
      y: 80,
      width: STAGE_WIDTH - 48,
      text: "",
      fontFamily: FONT_FAMILY,
      fontSize: 20,
      lineHeight: 1.2,
      fill: COLORS.text,
      listening: false,
    });
    this.group.add(this.questionText);

    // Options layout (right panel style similar to SimulationScreen)
    const RIGHT_PANEL_W = 300;
    const RIGHT_PANEL_PAD = 16;
    const OPT_W = RIGHT_PANEL_W - 2 * RIGHT_PANEL_PAD;
    const OPT_H = 50;
    const OPT_X = STAGE_WIDTH - RIGHT_PANEL_W + RIGHT_PANEL_PAD;
    const OPT_Y0 = 180;

    const labels = ["A)", "B)", "C)"];
    for (let i = 0; i < 3; i++) {
      const g = this.createPillButton(
        `${labels[i]} `,
        OPT_X,
        OPT_Y0 + i * (OPT_H + 14),
        OPT_W,
        OPT_H,
        22,
      );
      if (onOptionClick) {
        const idx = i as OptionIndex;
        g.on("click", () => onOptionClick(idx, g));
      }
      this.optionGroups.push(g);
      this.group.add(g);
    }

    // Navigation buttons
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
    if (onBackClick) backBtn.on("click", onBackClick);
    if (onNextClick) this.nextBtn.on("click", onNextClick);
    this.group.add(backBtn, this.nextBtn);

    // Disable NEXT by default
    this.setNextEnabled(false);
  }

  // Basic pill button used throughout screens for consistency
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

  // Public view API used by controller
  setQuestion(q: MiniGameQuestion): void {
    this.title.text(`MINIGAME`);
    this.title.offsetX(this.title.width() / 2);
    this.questionText.text(q.prompt);

    // Update option labels but preserve the leading "A)" etc.
    const labels = ["A)", "B)", "C)"];
    this.optionGroups.forEach((g, i) => {
      const textNode = g.findOne<Konva.Text>("Text");
      if (textNode) {
        textNode.text(`${labels[i]} ${q.options[i]}`);
      }

      const rect = g.findOne<Konva.Rect>("Rect");
      if (rect) {
        const base = rect.getAttr("baseFill") ?? COLORS.buttonFill;
        rect.fill(base);
      }
      g.setAttr("locked", false);
      g.listening(true);
    });

    this.group.getLayer()?.batchDraw();
  }

  setLives(lives: number): void {
    this.livesText.text(`Lives: ${lives}`);
    this.livesText.offsetX(this.livesText.width());
    this.group.getLayer()?.batchDraw();
  }

  setNextEnabled(enabled: boolean): void {
    this.nextBtn.setAttr("disabled", !enabled);
    this.nextBtn.opacity(enabled ? 1 : 0.5);
    this.nextBtn.listening(enabled);
    this.nextBtn.getLayer()?.batchDraw();
  }

  lockOptions(): void {
    this.optionGroups.forEach((g) => {
      g.setAttr("locked", true);
      g.listening(false);
    });
    this.group.getLayer()?.batchDraw();
  }

  unlockOptions(): void {
    this.optionGroups.forEach((g) => {
      g.setAttr("locked", false);
      g.listening(true);
    });
    this.group.getLayer()?.batchDraw();
  }

  markCorrect(index: OptionIndex): void {
    const g = this.optionGroups[index];
    const rect = g?.findOne<Konva.Rect>("Rect");
    if (rect) {
      rect.fill("#22c55e"); // green
    }
    this.lockOptions();
  }

  flashWrong(index: OptionIndex): void {
    const g = this.optionGroups[index];
    const rect = g?.findOne<Konva.Rect>("Rect");
    if (!rect) return;
    const base = rect.getAttr("baseFill") ?? COLORS.buttonFill;
    rect.fill("#ef4444"); // red
    g.getLayer()?.batchDraw();

    // brief flash then revert
    setTimeout(() => {
      rect.fill(base);
      g.getLayer()?.batchDraw();
    }, 300);
  }

  getOptionGroup(index: OptionIndex): Konva.Group {
    return this.optionGroups[index];
  }

  getAllOptions(): Konva.Group[] {
    return this.optionGroups.slice();
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

