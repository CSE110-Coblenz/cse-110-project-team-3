import Konva from "konva";
import { SIMULATION_CONSTANTS, STAGE_WIDTH } from "../../../constants";
import type { ScreenSwitcher } from "../../../types";
import { MinigameController } from "../../../types";
import { Minigame1SimulModel } from "./Minigame1SimulModel";
import { Minigame1SimulView } from "./Minigame1SimulView";

export class Minigame1SimulController extends MinigameController {
  private view: Minigame1SimulView;
  private model: Minigame1SimulModel;

  constructor(screenSwitcher: ScreenSwitcher, level: number) {
    super(screenSwitcher, level);

    // Randomize target distance each game
    const minDistance = 100;
    const maxDistance = STAGE_WIDTH - SIMULATION_CONSTANTS.starting_x - 100;
    const distancePixels =
      Math.floor(Math.random() * (maxDistance - minDistance + 1)) + minDistance;

    this.model = new Minigame1SimulModel(
      10,
      0.3, // Friction coefficient
      9.8, // Gravity (still in m/s^2, but will be used to calculate pixel acceleration)
      distancePixels, // distance in pixels
      1, // Mass
      SIMULATION_CONSTANTS.error_margin * 2, // error margin in pixels
    );

    this.view = new Minigame1SimulView(
      () => this.playSimulation(),
      () => this.resetSimulation(),
      this.model.getDistanceX(),
      this.model.getMass(),
      this.model.getFrictionCoefficient(),
      this.model.getInitialSpeed(),
      (delta) => this.adjustSpeed(delta),
    );
  }

  private adjustSpeed(delta: number): void {
    const current = this.model.getInitialSpeed();
    this.model.setInitialSpeed(current + delta);
    this.view.setSpeedDisplay(this.model.getInitialSpeed());
  }

  resetSimulation(): void {
    const box = this.view.getBox();
    box.position({
      x: SIMULATION_CONSTANTS.starting_x,
      y: SIMULATION_CONSTANTS.ground_level - 50,
    });
    this.view.hideCurrentSpeedText();
    this.view.getGroup().getLayer()?.draw();

    // After reset, allow playing again
    this.view.hideResetButton();
    if (this.lives > 0) this.view.showPlayButton();
    console.log("Simulation reset.");
  }

  playSimulation(): void {
    if (this.lives <= 0) {
      console.log("No lives left. Game over.");
      return;
    }

    const initialSpeedValue = this.model.getInitialSpeed();
    if (initialSpeedValue <= 0) {
      console.log("Initial speed must be greater than 0 to play.");
      return;
    }

    const box = this.view.getBox();
    box.show();
    this.view.getGroup().getLayer()?.draw();
    const initialX = box.x();

    const initialSpeed = initialSpeedValue;
    const friction = this.model.getFrictionCoefficient();
    const gravity = this.model.getGravity();
    const acceleration = -friction * gravity; // a = -mu * g, assuming gravity is scaled to pixels

    // Hide play to prevent multiple concurrent plays
    this.view.hidePlayButton();

    // Show current speed text
    this.view.showCurrentSpeedText();

    const targetDistance = this.model.getDistanceX();

    const animation = new Konva.Animation((frame) => {
      if (!frame) return;
      const t = (frame.time / 1000) * SIMULATION_CONSTANTS.speed_multiplier;

      const distance = initialSpeed * t + 0.5 * acceleration * t * t;
      const currentVelocity = initialSpeed + acceleration * t;

      this.view.updateCurrentSpeed(currentVelocity);
      box.x(initialX + distance);

      // Stop animation if block passes target
      if (box.x() - initialX >= targetDistance) {
        animation.stop();
        this.handleHit(true);
        return;
      }

      // Stop animation when the box stops
      if (currentVelocity <= 0) {
        animation.stop();
        this.view.updateCurrentSpeed(0);
        const finalDistance = box.x() - initialX;
        this.handleHit(this.model.isHit(finalDistance));
      }
    }, this.view.getGroup().getLayer());

    animation.start();
  }

  getView(): Minigame1SimulView {
    return this.view;
  }
}
