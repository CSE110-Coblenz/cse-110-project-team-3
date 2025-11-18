import Konva from "konva";
import type { View } from "../../../types";
import {
  COLORS,
  SIMULATION_CONSTANTS,
  STAGE_HEIGHT,
  STAGE_WIDTH,
  FONT_FAMILY,
} from "../../../constants";

export class MinigameSimulView implements View {
  private group: Konva.Group;
  private projectile: Konva.Circle;
  private playButton: Konva.Group;
  private resetButton: Konva.Group;
  private speedText: Konva.Text;
  private angleText: Konva.Text;
  private heartsGroup: Konva.Group;
  private onSpeedChange?: (delta: number) => void;
  private onAngleChange?: (delta: number) => void;
  private currentSpeed: number = 0;
  private currentAngle: number = 0;
  // Slider state
  private speedTrackX = 360;
  private speedTrackY = 32;
  private speedTrackWidth = 200;
  private speedMin = 0;
  private speedMax = 200;
  private speedStep = 1;
  private speedKnob!: Konva.Circle;
  private lastSpeedValue?: number;

  private angleTrackX = 360;
  private angleTrackY = 62;
  private angleTrackWidth = 200;
  private angleMin = 0;
  private angleMax = 90;
  private angleStep = 5;
  private angleKnob!: Konva.Circle;
  private lastAngleValue?: number;

  constructor(
    handlePlay?: () => void,
    handleReset?: () => void,
    handleReferenceClick?: () => void,
    distanceX: number = 0,
    height: number = 0,
    initialSpeed: number = 0,
    angle: number = 0,
    gravity: number = 0,
    onSpeedChange?: (delta: number) => void,
    onAngleChange?: (delta: number) => void
  ) {
    this.group = new Konva.Group();
    this.onSpeedChange = onSpeedChange;
    this.onAngleChange = onAngleChange;
    this.currentSpeed = initialSpeed;
    this.currentAngle = angle;

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
    // remove prompt; slider handles input

    this.angleText = new Konva.Text({
      x: 20,
      y: 50,
      text: `Angle: ${Math.round(angle / 5) * 5} degrees`,
      fontSize: 20,
      fontFamily: FONT_FAMILY,
      fill: COLORS.text,
    });
    this.group.add(this.angleText);
    // remove prompt; slider handles input

    const gravityText = new Konva.Text({
      x: 20,
      y: 80,
      text: `Gravity: ${gravity.toFixed(2)} m/s²`,
      fontSize: 20,
      fontFamily: FONT_FAMILY,
      fill: COLORS.text,
    });
    this.group.add(gravityText);

    const distanceText = new Konva.Text({
      x: 20,
      y: 110,
      text: `Target Distance: ${distanceX.toFixed(2)} m`,
      fontSize: 20,
      fontFamily: FONT_FAMILY,
      fill: COLORS.text,
    });
    this.group.add(distanceText);

    // Hearts (lives) display at top-right
    this.heartsGroup = new Konva.Group({ x: STAGE_WIDTH - 140, y: 20 });
    this.group.add(this.heartsGroup);
    this.setLives(3);

    // Simple +/- controls for speed and angle
    const controlButton = (
      label: string,
      x: number,
      y: number,
      onClick?: () => void
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
        this.speedMax
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
          Math.min(pos.x, this.speedTrackX + this.speedTrackWidth)
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
          Math.min(p.x, this.speedTrackX + this.speedTrackWidth)
        )
      );
      this.handleSpeedDrag();
    });

    // Angle slider
    const angleTrack = new Konva.Rect({
      x: this.angleTrackX,
      y: this.angleTrackY,
      width: this.angleTrackWidth,
      height: 6,
      fill: COLORS.buttonStroke,
      cornerRadius: 3,
    });
    this.group.add(angleTrack);
    this.angleKnob = new Konva.Circle({
      x: this.valueToX(
        this.currentAngle,
        this.angleTrackX,
        this.angleTrackWidth,
        this.angleMin,
        this.angleMax
      ),
      y: this.angleTrackY + 3,
      radius: 10,
      fill: COLORS.buttonFill,
      stroke: COLORS.buttonText,
      strokeWidth: 2,
      draggable: true,
      dragBoundFunc: (pos) => {
        const clampedX = Math.max(
          this.angleTrackX,
          Math.min(pos.x, this.angleTrackX + this.angleTrackWidth)
        );
        return { x: clampedX, y: this.angleTrackY + 3 };
      },
    });
    this.group.add(this.angleKnob);
    this.angleKnob.on("dragmove", () => this.handleAngleDrag());
    angleTrack.on("mousedown", () => {
      const p = this.group.getStage()?.getPointerPosition();
      if (!p) return;
      this.angleKnob.x(
        Math.max(
          this.angleTrackX,
          Math.min(p.x, this.angleTrackX + this.angleTrackWidth)
        )
      );
      this.handleAngleDrag();
    });

    // Speed controls next to slider
    const speedMinus = controlButton(
      "-",
      this.speedTrackX + this.speedTrackWidth + 20,
      20,
      () => this.onSpeedChange?.(-1)
    );
    const speedPlus = controlButton(
      "+",
      this.speedTrackX + this.speedTrackWidth + 54,
      20,
      () => this.onSpeedChange?.(1)
    );
    this.group.add(speedMinus);
    this.group.add(speedPlus);

    // Angle controls next to slider (step = 5)
    const angleMinus = controlButton(
      "-",
      this.angleTrackX + this.angleTrackWidth + 20,
      50,
      () => this.onAngleChange?.(-5)
    );
    const anglePlus = controlButton(
      "+",
      this.angleTrackX + this.angleTrackWidth + 54,
      50,
      () => this.onAngleChange?.(5)
    );
    this.group.add(angleMinus);
    this.group.add(anglePlus);

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

    // Add cannon image
    Konva.Image.fromURL("/cannon.png", (image) => {
      image.width(150);
      image.height(150);
      image.x(75);
      image.y(SIMULATION_CONSTANTS.ground_level - 100 - height);
      this.group.add(image);
    });

    // Add Target
    Konva.Image.fromURL("/target.png", (image) => {
      image.width(30);
      image.height(30);
      image.x(150 + distanceX - 15); // Cannon x + distanceX - half target width
      image.y(SIMULATION_CONSTANTS.ground_level - 15); // add an offset to match the ground level
      this.group.add(image);
    });

    // Projectile ball
    this.projectile = new Konva.Circle({
      x: SIMULATION_CONSTANTS.starting_x,
      y: SIMULATION_CONSTANTS.ground_level - height,
      radius: 10,
      fill: COLORS.nodeStroke,
    });
    this.group.add(this.projectile);
    this.projectile.hide();

    // Add Play Button
    this.playButton = this.createPillButton(
      "PLAY",
      STAGE_WIDTH - 150,
      STAGE_HEIGHT - 80,
      130,
      55
    );
    if (handlePlay) {
      this.playButton.on("click", handlePlay);
    }
    this.group.add(this.playButton);

    // Add Reference Button
    const referenceButton = this.createPillButton(
      "REFERENCE",
      20,
      STAGE_HEIGHT - 80,
      200,
      55,
    );
    if (handleReferenceClick) {
      referenceButton.on("click", handleReferenceClick);
    }
    this.group.add(referenceButton);

    // Add Reset Button (initially hidden)
    this.resetButton = this.createPillButton(
      "RESET",
      STAGE_WIDTH - 150,
      STAGE_HEIGHT - 80,
      130,
      55
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
    this.speedText.text(`Initial Speed: ${intVal} m/s`);
    this.currentSpeed = value;
    // update slider knob
    if (this.speedKnob) {
      this.speedKnob.x(
        this.valueToX(
          intVal,
          this.speedTrackX,
          this.speedTrackWidth,
          this.speedMin,
          this.speedMax
        )
      );
    }
    this.group.getLayer()?.draw();
  }

  setAngleDisplay(value: number): void {
    const stepped = Math.round(value / 5) * 5;
    this.angleText.text(`Angle: ${stepped} degrees`);
    this.currentAngle = value;
    // update slider knob
    if (this.angleKnob) {
      this.angleKnob.x(
        this.valueToX(
          stepped,
          this.angleTrackX,
          this.angleTrackWidth,
          this.angleMin,
          this.angleMax
        )
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
    max: number
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
    step: number
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
      this.speedStep
    );
    if (this.lastSpeedValue !== v) {
      const delta = v - this.currentSpeed;
      this.onSpeedChange?.(delta);
      this.lastSpeedValue = v;
    }
  }

  private handleAngleDrag(): void {
    const v = this.xToValue(
      this.angleKnob.x(),
      this.angleTrackX,
      this.angleTrackWidth,
      this.angleMin,
      this.angleMax,
      this.angleStep
    );
    if (this.lastAngleValue !== v) {
      const delta = v - this.currentAngle;
      this.onAngleChange?.(delta);
      this.lastAngleValue = v;
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
    height: number
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

  getProjectile(): Konva.Circle {
    return this.projectile;
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
