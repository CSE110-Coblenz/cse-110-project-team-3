import Konva from "konva";
import {
  COLORS,
  SIMULATION_CONSTANTS,
  STAGE_WIDTH,
  FONT_FAMILY,
} from "../../../constants";
import { BaseMinigameSimulView } from "../../../types";

const STARTING_X = 50;

export class Minigame1SimulView extends BaseMinigameSimulView {
  private box: Konva.Rect;
  private speedText: Konva.Text;
  private onSpeedChange?: (delta: number) => void;
  private currentSpeed: number = 0;
  private currSpeedText: Konva.Text;

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
    super(handlePlay, handleReset);
    this.onSpeedChange = onSpeedChange;
    this.currentSpeed = initialSpeed;

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
      text: `Target Distance: ${distanceX.toFixed(2)} m`,
      fontSize: 20,
      fontFamily: FONT_FAMILY,
      fill: COLORS.text,
    });
    this.group.add(distanceText);

    this.currSpeedText = new Konva.Text({
      x: 20,
      y: 140,
      text: `Current Speed: ${Math.round(this.currentSpeed)} m/s`,
      fontSize: 20,
      fontFamily: FONT_FAMILY,
      fill: COLORS.text,
    });
    this.currSpeedText.hide();
    this.group.add(this.currSpeedText);

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
          this.speedMax,
        ),
      );
    }
    this.group.getLayer()?.draw();
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

  showCurrentSpeedText(): void {
    this.currSpeedText.show();
  }

  hideCurrentSpeedText(): void {
    this.currSpeedText.hide();
  }

  updateCurrentSpeed(speed: number): void {
    this.currSpeedText.text(
      `Current Speed: ${Math.max(0, Math.round(speed))} m/s`,
    );
  }

  getBox(): Konva.Rect {
    return this.box;
  }
}
