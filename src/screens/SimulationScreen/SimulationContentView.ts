import Konva from "konva";
import type { View } from "../../types";
import {
  STAGE_WIDTH,
  STAGE_HEIGHT,
  FONT_FAMILY,
  COLORS,
} from "../../constants";
import type { SimulationScreenConfig, SimulationOptionConfig } from "./types";

export class SimulationContentView implements View {
  private group = new Konva.Group();
  private videoEl?: HTMLVideoElement;
  private imageNode?: Konva.Image;
  private anim?: Konva.Animation;

  private optionNodes: Konva.Group[] = [];
  private answeredCorrectly = false;
  private onCorrectAnswer: () => void;

  constructor(config: SimulationScreenConfig, onCorrectAnswer: () => void) {
    this.onCorrectAnswer = onCorrectAnswer;

    // Default offsets for layout positioning
    const layout = {
      top: config.layout?.topOffset ?? 200,
      bottom: config.layout?.bottomOffset ?? 120,
      left: config.layout?.leftOffset ?? 24,
      rightPanelWidth: config.layout?.rightPanelWidth ?? 300,
    };
    const rightPanelX = STAGE_WIDTH - layout.rightPanelWidth;

    // background
    const background = new Konva.Rect({
      x: 0,
      y: 0,
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
      fill: config.style?.backgroundColor ?? "black",
    });
    this.group.add(background);

    // title
    const title = new Konva.Text({
      text: config.title,
      fontStyle: "bold",
      fontSize: 40,
      fontFamily: FONT_FAMILY,
      fill: config.style?.titleColor ?? "white",
      x: STAGE_WIDTH / 2,
      y: 20,
    });
    title.offsetX(title.width() / 2);
    this.group.add(title);

    // problem text
    const questionText = new Konva.Text({
      x: 24,
      y: 75,
      width: STAGE_WIDTH - 48,
      text: config.description,
      fontFamily: FONT_FAMILY,
      fontSize: 18,
      lineHeight: 1.2,
      fill: config.style?.descriptionColor ?? "white",
      listening: false,
    });
    this.group.add(questionText);

    // video
    const src = new URL(config.video.src, import.meta.url).toString();

    this.videoEl = document.createElement("video");
    this.videoEl.src = src;
    this.videoEl.loop = config.video.loop ?? true;
    this.videoEl.muted = config.video.muted ?? true;
    this.videoEl.playsInline = true;
    this.videoEl.preload = "auto";
    this.videoEl.autoplay = true;

    // display video within the canvas context
    this.imageNode = new Konva.Image({
      x: layout.left,
      y: layout.top,
      width: rightPanelX - layout.left - 18, // leave space for right options panel
      height: STAGE_HEIGHT - layout.top - layout.bottom,
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
    const OPT_W = layout.rightPanelWidth - 2 * RIGHT_PANEL_PAD;
    const OPT_H = 50;
    const OPT_X = rightPanelX + RIGHT_PANEL_PAD;
    const OPT_Y0 = layout.top + 40;

    // option buttons
    config.options.forEach((opt, index) => {
      const optionGroup = this.createPillButton(
        opt.label,
        OPT_X,
        OPT_Y0 + index * (OPT_H + 14),
        OPT_W - 18, // space next buttons
        OPT_H,
        22,
      );
      this.group.add(optionGroup);
      this.optionNodes.push(optionGroup);

      optionGroup.on("click", () => this.handleOptionClick(opt, optionGroup));
    });
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

  // option selection
  private handleOptionClick(
    option: SimulationOptionConfig,
    node: Konva.Group,
  ): void {
    // Ignore if already answered correctly
    if (this.answeredCorrectly) return;

    const rect = node.findOne<Konva.Rect>("Rect");
    if (!rect) return;

    if (option.isCorrect) {
      // Correct answer: fill greeen, lock buttons and enable NEXT
      rect.fill("#22c55e");
      this.lockAll();
      this.answeredCorrectly = true;
      this.onCorrectAnswer();
    } else {
      // Wrong answer: fill red for a moment then revert to base color
      rect.fill("#ef4444");
      setTimeout(() => {
        rect.fill(COLORS.buttonFill);
        node.getLayer()?.batchDraw();
      }, 700);
    }
    node.getLayer()?.batchDraw();
  }

  // Locks all option buttons to prevent further interaction
  private lockAll(): void {
    this.optionNodes.forEach((g) => {
      g.setAttr("locked", true);
      g.listening(false);
    });
  }

  getGroup(): Konva.Group {
    return this.group;
  }

  show(): void {
    this.group.visible(true);
    if (this.videoEl && this.videoEl.paused && this.videoEl.autoplay) {
      this.videoEl.play();
    }
    this.group.getLayer()?.draw();
  }

  hide(): void {
    this.group.visible(false);
    if (this.videoEl) this.videoEl.pause();
    this.group.getLayer()?.draw();
  }
}
