import { BaseMinigameSimulModel } from "../../../types";

export class MinigameSimulModel extends BaseMinigameSimulModel {
  private angle: number;
  private initial_height: number;

  constructor(
    initial_speed: number,
    angle: number,
    gravity: number,
    distance_x: number,
    initial_height: number = 0,
    margin_of_error: number = 5
  ) {
    super(initial_speed, distance_x, margin_of_error, gravity);
    this.angle = angle;
    this.initial_height = initial_height;
  }

  getAngle(): number {
    return this.angle;
  }

  setAngle(v: number): void {
    // multiples of 5 within [0,90]
    const roundedTo5 = Math.round(v / 5) * 5;
    const clamped = Math.max(0, Math.min(roundedTo5, 90));
    this.angle = clamped;
  }

  getInitialHeight(): number {
    return this.initial_height;
  }
}
