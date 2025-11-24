import Konva from "konva";
import {
  COLORS,
  SIMULATION_CONSTANTS,
  STAGE_WIDTH,
  STAGE_HEIGHT,
  FONT_FAMILY,
} from "../../../constants";
import { BaseMinigameSimulView } from "../../../types";

export class Minigame1SimulView extends BaseMinigameSimulView {
  private box: Konva.Rect;
  private speedText: Konva.Text;
  private onSpeedChange?: (delta: number) => void;
  private currentSpeed: number = 0;
  private currSpeedText: Konva.Text;
  private gapX: number;
  private distanceX: number;

  // Distance arrows and labels
  private gapArrow!: Konva.Arrow;
  private gapLabel!: Konva.Text;
  private boxToFirstArrow!: Konva.Arrow;
  private boxToFirstLabel!: Konva.Text;
  private arrowYGap: number;
  private arrowYBox: number;

  // Slider state
  private speedTrackX = 360;
  private speedTrackY = 32;
  private speedTrackWidth = 200;
  private speedKnob!: Konva.Circle;
  private lastSpeedValue?: number;

  constructor(
    handlePlay?: () => void,
    handleReset?: () => void,
    handleReferenceClick?: () => void,
    distanceX: number = 0,
    mass: number = 1,
    friction: number = 0.2,
    initialSpeed: number = 0,
    gapX: number = 0,
    onSpeedChange?: (delta: number) => void,
  ) {
    super(handlePlay, handleReset);
    this.onSpeedChange = onSpeedChange;
    this.currentSpeed = initialSpeed;
    this.gapX = gapX;
    this.distanceX = distanceX;

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

    // Arrow vertical positions
    this.arrowYGap = SIMULATION_CONSTANTS.ground_level - 36;
    this.arrowYBox = SIMULATION_CONSTANTS.ground_level - 72;

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
        SIMULATION_CONSTANTS.speed_min,
        SIMULATION_CONSTANTS.speed_max,
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

    // Precompute checkpoint x positions
    const firstCheckpointX = SIMULATION_CONSTANTS.starting_x + this.distanceX;
    const secondCheckpointX = firstCheckpointX + this.gapX;

    // Add Two Target
    Konva.Image.fromURL("/target.png", (image) => {
      image.width(30);
      image.height(30);
      image.x(firstCheckpointX - 15);
      image.y(SIMULATION_CONSTANTS.ground_level - 15);
      this.group.add(image);
    });

    Konva.Image.fromURL("/target.png", (image) => {
      image.width(30);
      image.height(30);
      image.x(secondCheckpointX - 15);
      image.y(SIMULATION_CONSTANTS.ground_level - 15);
      this.group.add(image);
    });

    // Movable box
    this.box = new Konva.Rect({
      x: SIMULATION_CONSTANTS.starting_x,
      y: SIMULATION_CONSTANTS.ground_level - 50,
      width: 50,
      height: 50,
      fill: COLORS.buttonFill,
      stroke: COLORS.buttonStroke,
      strokeWidth: 4,
      cornerRadius: 6,
    });
    this.group.add(this.box);

    // Gap arrow between checkpoints
    this.gapArrow = new Konva.Arrow({
      points: [
        firstCheckpointX,
        this.arrowYGap,
        secondCheckpointX,
        this.arrowYGap,
      ],
      stroke: COLORS.arrow,
      strokeWidth: 2,
      pointerAtBeginning: true,
      pointerLength: 10,
      pointerWidth: 10,
    });
    this.group.add(this.gapArrow);
    this.gapLabel = new Konva.Text({
      x: (firstCheckpointX + secondCheckpointX) / 2,
      y: this.arrowYGap - 20,
      text: `${this.gapX.toFixed(0)} m`,
      fontSize: 16,
      fontFamily: FONT_FAMILY,
      fill: COLORS.text,
      align: "center",
    });
    this.group.add(this.gapLabel);

    // Arrow from box (left edge) to first checkpoint
    this.boxToFirstArrow = new Konva.Arrow({
      points: [this.box.x(), this.arrowYBox, firstCheckpointX, this.arrowYBox],
      stroke: COLORS.arrow,
      strokeWidth: 2,
      pointerAtBeginning: true,
      pointerLength: 10,
      pointerWidth: 10,
    });
    this.group.add(this.boxToFirstArrow);
    this.boxToFirstLabel = new Konva.Text({
      x: (this.box.x() + firstCheckpointX) / 2,
      y: this.arrowYBox - 20,
      text: `${Math.max(0, Math.round(firstCheckpointX - this.box.x()))} m`,
      fontSize: 16,
      fontFamily: FONT_FAMILY,
      fill: COLORS.text,
      align: "center",
    });
    this.group.add(this.boxToFirstLabel);

    // Initial alignment of labels
    this.updateArrows(this.box.x());
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
          SIMULATION_CONSTANTS.speed_min,
          SIMULATION_CONSTANTS.speed_max,
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
      SIMULATION_CONSTANTS.speed_min,
      SIMULATION_CONSTANTS.speed_max,
      SIMULATION_CONSTANTS.speed_step,
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

  // Update arrows and labels based on the current box x
  updateArrows(currentBoxX: number): void {
    const firstCheckpointX = SIMULATION_CONSTANTS.starting_x + this.distanceX;
    const secondCheckpointX = firstCheckpointX + this.gapX;

    // Update gap arrow (static horizontal span)
    this.gapArrow.points([
      firstCheckpointX,
      this.arrowYGap,
      secondCheckpointX,
      this.arrowYGap,
    ]);
    // Center gap label
    const gapCenterX = (firstCheckpointX + secondCheckpointX) / 2;
    this.gapLabel.text(`${this.gapX.toFixed(0)} m`);
    this.gapLabel.x(gapCenterX - this.gapLabel.width() / 2);

    // Update box-to-first arrow (use absolute order so arrow always left->right)
    const a = Math.min(currentBoxX, firstCheckpointX);
    const b = Math.max(currentBoxX, firstCheckpointX);
    this.boxToFirstArrow.points([a, this.arrowYBox, b, this.arrowYBox]);
    const d1 = Math.max(
      0,
      Math.round(Math.abs(firstCheckpointX - currentBoxX)),
    );
    const d1Center = (a + b) / 2;
    this.boxToFirstLabel.text(`${d1} m`);
    this.boxToFirstLabel.x(d1Center - this.boxToFirstLabel.width() / 2);

    // Ensure redraw
    this.group.getLayer()?.draw();
  }

  getBox(): Konva.Rect {
    return this.box;
  }
}
