import Konva from "konva";
import type { View } from "../../types";
import {
  STAGE_WIDTH,
  STAGE_HEIGHT,
  FONT_FAMILY,
  COLORS,
} from "../../constants";

// Problem statement
export const Lev2text = `A ball is launched from ground level at the origin O with an initial angle of 45°. Air resistance is negligible.
An obstacle's top is at point A = (20 m, 10 m).
What is the minimum launch speed required so that the ball's trajectory passes at or above point A?`;

type OptionKey = "A" | "B" | "C";

export class Lev2 implements View {
  private group = new Konva.Group();
  private videoEl: HTMLVideoElement;
  private imageNode: Konva.Image;
  private anim?: Konva.Animation;

  private optionA!: Konva.Group;
  private optionB!: Konva.Group;
  private optionC!: Konva.Group;

  private answeredCorrectly = false;
  private handleNextEnable?: (enable: boolean) => void;

  constructor(
    opts?: {
      topOffset?: number;
      bottomOffset?: number;
      leftOffset?: number;
      rightOffset?: number;
    },
    handleNextEnable?: (enable: boolean) => void,
  ) {
    this.handleNextEnable = handleNextEnable;

    // Default offsets for layout positioning
    const RIGHT_PANEL_W = 300;
    const DEFAULTS = {
      top: 200,
      bottom: 120,
      left: 24,
      right: RIGHT_PANEL_W + 24, // leave space for right options panel
    };

    const top = opts?.topOffset ?? DEFAULTS.top;
    const bottom = opts?.bottomOffset ?? DEFAULTS.bottom;
    const left = opts?.leftOffset ?? DEFAULTS.left;
    const right = opts?.rightOffset ?? DEFAULTS.right;

    // background
    const background = new Konva.Rect({
      x: 0,
      y: 0,
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
      fill: "black",
    });
    this.group.add(background);

    // title
    const title = new Konva.Text({
      text: `SIMULATION: Projectile Motion`,
      fontStyle: "bold",
      fontSize: 40,
      fontFamily: FONT_FAMILY,
      fill: "white",
      x: STAGE_WIDTH / 2,
      y: 16,
    });
    title.offsetX(title.width() / 2);
    this.group.add(title);

    // problem text
    const questionText = new Konva.Text({
      x: 24,
      y: 75,
      width: STAGE_WIDTH - 48,
      text: Lev2text,
      fontFamily: FONT_FAMILY,
      fontSize: 18,
      lineHeight: 1.2,
      fill: "white",
      listening: false,
    });
    this.group.add(questionText);

    // video
    const src = new URL("/Force.mp4", import.meta.url).toString();

    this.videoEl = document.createElement("video");
    this.videoEl.src = src;
    this.videoEl.loop = true;
    this.videoEl.muted = true;
    this.videoEl.playsInline = true;
    this.videoEl.preload = "auto";
    this.videoEl.autoplay = true;

    // display video within the canvas context
    this.imageNode = new Konva.Image({
      x: left,
      y: top,
      width: STAGE_WIDTH - left - right,
      height: STAGE_HEIGHT - top - bottom,
      image: this.videoEl,
      listening: false,
    });
    this.group.add(this.imageNode);

    // video animation control
    const ensureAnim = () => {
      if (!this.anim) {
        const layer = this.group.getLayer();
        if (!layer) return;
        this.anim = new Konva.Animation(() => {}, layer);
      }
      this.anim.start();
    };
    this.videoEl.addEventListener("play", ensureAnim);
    this.videoEl.addEventListener("pause", () => this.anim?.stop());
    this.videoEl.addEventListener("ended", () => this.anim?.stop());
    this.group.on("added", () => requestAnimationFrame(ensureAnim));

    // right side options panel
    const RIGHT_PANEL_PAD = 16;
    const OPT_W = RIGHT_PANEL_W - 2 * RIGHT_PANEL_PAD;
    const OPT_H = 50;
    const OPT_X = STAGE_WIDTH - RIGHT_PANEL_W + RIGHT_PANEL_PAD;
    const OPT_Y0 = top + 40;

    // option buttons
    this.optionA = this.createPillButton(
      "A) 18.8 m/s",
      OPT_X,
      OPT_Y0,
      OPT_W,
      OPT_H,
      22,
    );
    this.optionB = this.createPillButton(
      "B) 19.8 m/s",
      OPT_X,
      OPT_Y0 + (OPT_H + 14),
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

    this.group.add(this.optionA, this.optionB, this.optionC);

    // option selection
    const handleOptionClick = (key: OptionKey, node: Konva.Group) => {
      // Ignore if already answered correctly
      if (this.answeredCorrectly) return;

      const rect = node.findOne<Konva.Rect>("Rect");
      if (!rect) return;

      if (key === "B") {
        // Correct answer: fill greeen, lock buttons and enable NEXT
        rect.fill("#22c55e");
        this.lockAll();
        this.answeredCorrectly = true;
        this.setNextEnabled(true);
      } else {
        // Wrong answer: fill red for a moment then revert to base color
        rect.fill("#ef4444");
        setTimeout(() => {
          rect.fill(COLORS.buttonFill);
          node.getLayer()?.batchDraw();
        }, 700);
      }
      node.getLayer()?.batchDraw();
    };

    // click handler for each option
    this.optionA.on("click", () => handleOptionClick("A", this.optionA));
    this.optionB.on("click", () => handleOptionClick("B", this.optionB));
    this.optionC.on("click", () => handleOptionClick("C", this.optionC));
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

  // Called when correct answer is clicked to enable the NEXT button in SimulationScreenView
  public setNextEnabled(enabled: boolean): void {
    if (this.handleNextEnable) this.handleNextEnable(enabled);
  }

  public getOption(key: OptionKey): Konva.Group {
    if (key === "A") return this.optionA;
    if (key === "B") return this.optionB;
    return this.optionC;
  }
  public getAllOptions(): Konva.Group[] {
    return [this.optionA, this.optionB, this.optionC];
  }

  // Locks all option buttons to prevent further interaction
  private lockAll(): void {
    [this.optionA, this.optionB, this.optionC].forEach((g) => {
      g.setAttr("locked", true);
      g.listening(false);
    });
  }

  getGroup(): Konva.Group {
    return this.group;
  }

  show(): void {
    this.group.visible(true);
    if (this.videoEl.paused && this.videoEl.autoplay) this.videoEl.play();
    this.group.getLayer()?.draw();
  }

  hide(): void {
    this.group.visible(false);
    this.videoEl.pause();
    this.group.getLayer()?.draw();
  }
}
