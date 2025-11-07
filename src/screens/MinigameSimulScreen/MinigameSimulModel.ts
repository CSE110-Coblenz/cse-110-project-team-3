export class MinigameSimulModel {
  private initial_speed: number;
  private angle: number;
  private gravity: number;
  private initial_height: number;
  private distance_x: number;
  private margin_of_error: number;

  constructor(
    initial_speed: number,
    angle: number,
    gravity: number,
    distance_x: number,
    initial_height: number = 0,
    margin_of_error: number = 5,
  ) {
    this.initial_speed = initial_speed;
    this.angle = angle;
    this.gravity = gravity;
    this.initial_height = initial_height;
    this.distance_x = distance_x;
    this.margin_of_error = margin_of_error;
  }

  getInitialSpeed(): number {
    return this.initial_speed;
  }

  getAngle(): number {
    return this.angle;
  }

  getGravity(): number {
    return this.gravity;
  }

  getInitialHeight(): number {
    return this.initial_height;
  }

  getDistanceX(): number {
    return this.distance_x;
  }

  isHit(landingDistance: number): boolean {
    return Math.abs(landingDistance - this.distance_x) <= this.margin_of_error;
  }
}
