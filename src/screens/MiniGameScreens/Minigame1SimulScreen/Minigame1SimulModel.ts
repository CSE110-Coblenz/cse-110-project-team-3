import { BaseMinigameSimulModel } from "../../../types";

export class Minigame1SimulModel extends BaseMinigameSimulModel {
  private friction_coefficient: number;
  private mass: number;

  constructor(
    initial_speed: number,
    friction_coefficient: number,
    gravity: number,
    distance_x: number,
    mass: number,
    margin_of_error: number = 5,
  ) {
    super(initial_speed, distance_x, margin_of_error, gravity);
    this.friction_coefficient = friction_coefficient;
    this.mass = mass;
  }

  getFrictionCoefficient(): number {
    return this.friction_coefficient;
  }

  getMass(): number {
    return this.mass;
  }
}
