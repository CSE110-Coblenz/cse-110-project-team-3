import Konva from "konva";
import type { View } from "../../types";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants";

export const Lev1text =
`A ball is launched from ground level at the origin O with an initial angle of 45°. Air resistance is negligible.
An obstacle's top is at point A = (20 m, 10 m).
What is the minimum launch speed required so that the ball's trajectory passes at or above point A?`;

export class Lev1Force implements View {
  private group = new Konva.Group();
  private videoEl: HTMLVideoElement;
  private imageNode: Konva.Image;
  private anim?: Konva.Animation;

  constructor(opts?: {
    topOffset?: number;
    bottomOffset?: number;
    leftOffset?: number;
    rightOffset?: number;
  }) {
    const top = opts?.topOffset ?? 100;
    const bottom = opts?.bottomOffset ?? 90;
    const left = opts?.leftOffset ?? 0;
    const right = opts?.rightOffset ?? 0;

    const src = new URL("./Force.mp4", import.meta.url).toString();

    // HTMLVideoElement configured for autoplaying loop 
    this.videoEl = document.createElement("video");
    this.videoEl.src = src;
    this.videoEl.loop = true;
    this.videoEl.muted = true;
    this.videoEl.playsInline = true;
    this.videoEl.preload = "auto";
    this.videoEl.autoplay = true;

    // Konva.Image that paints the current video frame
    this.imageNode = new Konva.Image({
      x: left,
      y: top,
      width: STAGE_WIDTH - left - right,
      height: STAGE_HEIGHT - top - bottom,
      image: this.videoEl,
      listening: false,
    });
    this.group.add(this.imageNode);

    // start/stop a Konva.Animation so the layer repaints at each frame
    const ensureAnimStart = () => {
      if (!this.anim) {
        const layer = this.group.getLayer();
        if (!layer) return;
        this.anim = new Konva.Animation(() => {}, layer);
      }
      this.anim?.start();
    };

    this.videoEl.addEventListener("play", ensureAnimStart);
    this.videoEl.addEventListener("pause", () => this.anim?.stop());
    this.videoEl.addEventListener("ended", () => this.anim?.stop());

    // if the group is attached later, kick animation on next frame
    this.group.on("added", () => requestAnimationFrame(ensureAnimStart));
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
