import { BaseMinigameSimulModel } from "../../../types";

export class Minigame1SimulModel extends BaseMinigameSimulModel {
  private friction_coefficient: number;
  private mass: number;
  private gap_x: number;

  constructor(
    initial_speed: number,
    friction_coefficient: number,
    gravity: number,
    distance_x: number,
    mass: number,
    gap_x: number,
    margin_of_error: number = 5,
  ) {
    super(initial_speed, distance_x, margin_of_error, gravity);
    this.friction_coefficient = friction_coefficient;
    this.gap_x = gap_x;
    this.mass = mass;
  }

  getFrictionCoefficient(): number {
    return this.friction_coefficient;
  }

  getMass(): number {
    return this.mass;
  }

  getGapX(): number {
    return this.gap_x;
  }

  isHit(landingDistance: number): boolean {
    const targetDistance = this.getDistanceX();

    // Check if the landing distance is between targetDistance and targetDistance + gap_x
    return (
      landingDistance >= targetDistance &&
      landingDistance <= targetDistance + this.getGapX()
    );
  }
}
