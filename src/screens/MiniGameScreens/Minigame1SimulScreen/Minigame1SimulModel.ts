export class Minigame1SimulModel {
  private initial_speed: number;
  private friction_coefficient: number;
  private gravity: number;
  private distance_x: number;
  private margin_of_error: number;
  private mass: number;

  constructor(
    initial_speed: number,
    friction_coefficient: number,
    gravity: number,
    distance_x: number,
    mass: number,
    margin_of_error: number = 5,
  ) {
    this.initial_speed = initial_speed;
    this.friction_coefficient = friction_coefficient;
    this.gravity = gravity;
    this.distance_x = distance_x;
    this.mass = mass;
    this.margin_of_error = margin_of_error;
  }

  getInitialSpeed(): number {
    return this.initial_speed;
  }

  getFrictionCoefficient(): number {
    return this.friction_coefficient;
  }

  getGravity(): number {
    return this.gravity;
  }

  getDistanceX(): number {
    return this.distance_x;
  }

  getMass(): number {
    return this.mass;
  }

  getMarginOfError(): number {
    return this.margin_of_error;
  }

  setInitialSpeed(v: number): void {
    // integer m/s, prevent negative, cap reasonable upper bound
    const rounded = Math.round(v);
    const clamped = Math.max(0, Math.min(rounded, 300));
    this.initial_speed = clamped;
  }

  isHit(landingDistance: number): boolean {
    return Math.abs(landingDistance - this.distance_x) <= this.margin_of_error;
  }
}
