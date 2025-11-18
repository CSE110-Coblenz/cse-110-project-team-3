import Konva from "konva";
import type { View } from "../../../types";
import {
  COLORS,
  SIMULATION_CONSTANTS,
  STAGE_HEIGHT,
  STAGE_WIDTH,
  FONT_FAMILY,
} from "../../../constants";

const STARTING_X = 50;

export class Minigame1SimulView implements View {
  private group: Konva.Group;
  private box: Konva.Rect;
  private playButton: Konva.Group;
  private resetButton: Konva.Group;
  private speedText: Konva.Text;
  private heartsGroup: Konva.Group;
  private onSpeedChange?: (delta: number) => void;
  private currentSpeed: number = 0;

  // Slider state
  private speedTrackX = 360;
  private speedTrackY = 32;
  private speedTrackWidth = 200;
  private speedMin = 0;
  private speedMax = 200; // Assuming speed max
  private speedStep = 1;
  private speedKnob!: Konva.Circle;
  private lastSpeedValue?: number;

  constructor(
    handlePlay?: () => void,
    handleReset?: () => void,
    distanceX: number = 0,
    mass: number = 1,
    friction: number = 0.2,
    initialSpeed: number = 0,
    onSpeedChange?: (delta: number) => void,
  ) {
    this.group = new Konva.Group();
    this.onSpeedChange = onSpeedChange;
    this.currentSpeed = initialSpeed;

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

    // Display parameters
    this.speedText = new Konva.Text({
      x: 20,
      y: 20,
      text: `Initial Speed: ${Math.round(initialSpeed)} m/s`,
      fontSize: 20,
      fontFamily: FONT_FAMILY,
      fill: COLORS.text,
    });
    this.group.add(this.speedText);

    const massText = new Konva.Text({
      x: 20,
      y: 50,
      text: `Mass: ${mass.toFixed(1)} kg`,
      fontSize: 20,
      fontFamily: FONT_FAMILY,
      fill: COLORS.text,
    });
    this.group.add(massText);

    const frictionText = new Konva.Text({
      x: 20,
      y: 80,
      text: `Friction Coeff.: ${friction.toFixed(2)}`,
      fontSize: 20,
      fontFamily: FONT_FAMILY,
      fill: COLORS.text,
    });
    this.group.add(frictionText);

    const distanceText = new Konva.Text({
      x: 20,
      y: 110,
      text: `Target Distance: ${distanceX.toFixed(2)}`,
      fontSize: 20,
      fontFamily: FONT_FAMILY,
      fill: COLORS.text,
    });
    this.group.add(distanceText);

    // Hearts (lives) display at top-right
    this.heartsGroup = new Konva.Group({ x: STAGE_WIDTH - 140, y: 20 });
    this.group.add(this.heartsGroup);
    this.setLives(3);

    // Simple +/- controls for force
    const controlButton = (
      label: string,
      x: number,
      y: number,
      onClick?: () => void,
    ) => {
      const g = new Konva.Group({ x, y });
      const rect = new Konva.Rect({
        width: 28,
        height: 24,
        cornerRadius: 6,
        fill: COLORS.buttonFill,
        stroke: COLORS.buttonStroke,
        strokeWidth: 2,
        shadowOpacity: 0.1,
        shadowBlur: 4,
      });
      const t = new Konva.Text({
        text: label,
        fontSize: 18,
        fontFamily: FONT_FAMILY,
        fill: COLORS.buttonText,
        width: 28,
        height: 24,
        align: "center",
        verticalAlign: "middle",
      });
      g.add(rect);
      g.add(t);
      if (onClick) g.on("click", onClick);
      return g;
    };

    // Speed slider
    const speedTrack = new Konva.Rect({
      x: this.speedTrackX,
      y: this.speedTrackY,
      width: this.speedTrackWidth,
      height: 6,
      fill: COLORS.buttonStroke,
      cornerRadius: 3,
    });
    this.group.add(speedTrack);
    this.speedKnob = new Konva.Circle({
      x: this.valueToX(
        this.currentSpeed,
        this.speedTrackX,
        this.speedTrackWidth,
        this.speedMin,
        this.speedMax,
      ),
      y: this.speedTrackY + 3,
      radius: 10,
      fill: COLORS.buttonFill,
      stroke: COLORS.buttonText,
      strokeWidth: 2,
      draggable: true,
      dragBoundFunc: (pos) => {
        const clampedX = Math.max(
          this.speedTrackX,
          Math.min(pos.x, this.speedTrackX + this.speedTrackWidth),
        );
        return { x: clampedX, y: this.speedTrackY + 3 };
      },
    });
    this.group.add(this.speedKnob);
    this.speedKnob.on("dragmove", () => this.handleSpeedDrag());
    speedTrack.on("mousedown", (evt) => {
      const p = this.group.getStage()?.getPointerPosition();
      if (!p) return;
      this.speedKnob.x(
        Math.max(
          this.speedTrackX,
          Math.min(p.x, this.speedTrackX + this.speedTrackWidth),
        ),
      );
      this.handleSpeedDrag();
    });

    // Speed controls next to slider
    const speedMinus = controlButton(
      "-",
      this.speedTrackX + this.speedTrackWidth + 20,
      20,
      () => this.onSpeedChange?.(-1),
    );
    const speedPlus = controlButton(
      "+",
      this.speedTrackX + this.speedTrackWidth + 54,
      20,
      () => this.onSpeedChange?.(1),
    );
    this.group.add(speedMinus);
    this.group.add(speedPlus);

    // Line to indicate the ground
    const groundLine = new Konva.Line({
      points: [
        0,
        SIMULATION_CONSTANTS.ground_level,
        STAGE_WIDTH,
        SIMULATION_CONSTANTS.ground_level,
      ],
      stroke: COLORS.ground,
      strokeWidth: 4,
    });
    this.group.add(groundLine);

    // Add Target
    Konva.Image.fromURL("/target.png", (image) => {
      image.width(30);
      image.height(30);
      image.x(STARTING_X + distanceX - 15); // Box start x + distanceX - half target width
      image.y(SIMULATION_CONSTANTS.ground_level - 15); // offset to sit on the ground
      this.group.add(image);
    });

    // Movable box
    this.box = new Konva.Rect({
      x: STARTING_X,
      y: SIMULATION_CONSTANTS.ground_level - 50,
      width: 50,
      height: 50,
      fill: COLORS.buttonFill,
      stroke: COLORS.buttonStroke,
      strokeWidth: 4,
      cornerRadius: 6,
    });
    this.group.add(this.box);

    // Add Play Button
    this.playButton = this.createPillButton(
      "PLAY",
      STAGE_WIDTH - 150,
      STAGE_HEIGHT - 80,
      130,
      55,
    );
    if (handlePlay) {
      this.playButton.on("click", handlePlay);
    }
    this.group.add(this.playButton);

    // Add Reset Button
    this.resetButton = this.createPillButton(
      "RESET",
      STAGE_WIDTH - 150,
      STAGE_HEIGHT - 80,
      130,
      55,
    );

    if (handleReset) {
      this.resetButton.on("click", handleReset);
    }

    this.resetButton.hide();
    this.group.add(this.resetButton);
  }

  hidePlayButton(): void {
    this.playButton.hide();
  }

  addResetButton(): void {
    this.resetButton.show();
  }

  hideResetButton(): void {
    this.resetButton.hide();
  }

  showPlayButton(): void {
    this.playButton.show();
  }

  setSpeedDisplay(value: number): void {
    const intVal = Math.round(value);
    this.speedText.text(`Initial Speed: ${intVal} px/s`);
    this.currentSpeed = value;
    // update slider knob
    if (this.speedKnob) {
      this.speedKnob.x(
        this.valueToX(
          intVal,
          this.speedTrackX,
          this.speedTrackWidth,
          this.speedMin,
          this.speedMax,
        ),
      );
    }
    this.group.getLayer()?.draw();
  }

  // Helpers for sliders
  private valueToX(
    value: number,
    trackX: number,
    trackW: number,
    min: number,
    max: number,
  ): number {
    const t = (value - min) / (max - min);
    return trackX + t * trackW;
  }

  private xToValue(
    x: number,
    trackX: number,
    trackW: number,
    min: number,
    max: number,
    step: number,
  ): number {
    const t = (x - trackX) / trackW;
    const raw = min + t * (max - min);
    const stepped = Math.round(raw / step) * step;
    return Math.max(min, Math.min(stepped, max));
  }

  private handleSpeedDrag(): void {
    const v = this.xToValue(
      this.speedKnob.x(),
      this.speedTrackX,
      this.speedTrackWidth,
      this.speedMin,
      this.speedMax,
      this.speedStep,
    );
    if (this.lastSpeedValue !== v) {
      const delta = v - this.currentSpeed;
      this.onSpeedChange?.(delta);
      this.lastSpeedValue = v;
    }
  }

  setLives(lives: number): void {
    this.heartsGroup.destroyChildren();
    const heartChar = "❤"; // red heart
    for (let i = 0; i < 3; i++) {
      const t = new Konva.Text({
        x: i * 40,
        y: 0,
        text: heartChar,
        fontSize: 28,
        fontFamily: FONT_FAMILY,
        fill: i < lives ? "#ff4d4f" : "#555555",
      });
      this.heartsGroup.add(t);
    }
    this.group.getLayer()?.draw();
  }

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
      shadowOpacity: 0.15,
      shadowBlur: 8,
    });
    g.add(rect);

    const text = new Konva.Text({
      text: label,
      fontSize: 32,
      fontFamily: FONT_FAMILY,
      fill: COLORS.buttonText,
      width,
      height,
      align: "center",
      verticalAlign: "middle",
    });
    g.add(text);

    return g;
  }

  getBox(): Konva.Rect {
    return this.box;
  }

  getGroup(): Konva.Group {
    return this.group;
  }

  show(): void {
    this.group.show();
  }

  hide(): void {
    this.group.hide();
  }
}
