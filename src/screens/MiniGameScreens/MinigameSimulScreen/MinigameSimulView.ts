import Konva from "konva";
import {
  COLORS,
  SIMULATION_CONSTANTS,
  STAGE_WIDTH,
  STAGE_HEIGHT,
  FONT_FAMILY,
} from "../../../constants";
import { BaseMinigameSimulView } from "../../../types";

export class MinigameSimulView extends BaseMinigameSimulView {
  private projectile: Konva.Circle;
  private speedText: Konva.Text;
  private angleText: Konva.Text;
  private onSpeedChange?: (delta: number) => void;
  private onAngleChange?: (delta: number) => void;
  private currentSpeed: number = 0;
  private currentAngle: number = 0;
  // Slider state
  private speedTrackX = 360;
  private speedTrackY = 32;
  private speedTrackWidth = 200;
  private speedKnob!: Konva.Circle;
  private lastSpeedValue?: number;

  private angleTrackX = 360;
  private angleTrackY = 62;
  private angleTrackWidth = 200;
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
    super(handlePlay, handleReset);
    this.onSpeedChange = onSpeedChange;
    this.onAngleChange = onAngleChange;
    this.currentSpeed = initialSpeed;
    this.currentAngle = angle;

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

    this.angleText = new Konva.Text({
      x: 20,
      y: 50,
      text: `Angle: ${Math.round(angle / 5) * 5} degrees`,
      fontSize: 20,
      fontFamily: FONT_FAMILY,
      fill: COLORS.text,
    });
    this.group.add(this.angleText);

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
        SIMULATION_CONSTANTS.projectile_speed_min,
        SIMULATION_CONSTANTS.projectile_speed_max
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
        SIMULATION_CONSTANTS.angle_min,
        SIMULATION_CONSTANTS.angle_max
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

    this.resetButton = this.createPillButton(
      "RESET",
      STAGE_WIDTH - 150,
      STAGE_HEIGHT - 80,
      130,
      55
    );

    // Add Reference Button
    const referenceButton = this.createPillButton(
      "REFERENCE",
      20,
      STAGE_HEIGHT - 80,
      200,
      55
    );
    if (handleReferenceClick) {
      referenceButton.on("click", handleReferenceClick);
    }
    this.group.add(referenceButton);

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
          SIMULATION_CONSTANTS.projectile_speed_min,
          SIMULATION_CONSTANTS.projectile_speed_max
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
          SIMULATION_CONSTANTS.angle_min,
          SIMULATION_CONSTANTS.angle_max
        )
      );
    }
    this.group.getLayer()?.draw();
  }

  private handleSpeedDrag(): void {
    const v = this.xToValue(
      this.speedKnob.x(),
      this.speedTrackX,
      this.speedTrackWidth,
      SIMULATION_CONSTANTS.projectile_speed_min,
      SIMULATION_CONSTANTS.projectile_speed_max,
      SIMULATION_CONSTANTS.speed_step
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
      SIMULATION_CONSTANTS.angle_min,
      SIMULATION_CONSTANTS.angle_max,
      SIMULATION_CONSTANTS.angle_step
    );
    if (this.lastAngleValue !== v) {
      const delta = v - this.currentAngle;
      this.onAngleChange?.(delta);
      this.lastAngleValue = v;
    }
  }

  getProjectile(): Konva.Circle {
    return this.projectile;
  }
}
