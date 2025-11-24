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
    const minDistance = SIMULATION_CONSTANTS.simulation_min_distance_to_target;
    const maxDistance = STAGE_WIDTH - SIMULATION_CONSTANTS.starting_x - 100;
    const distancePixels =
      Math.floor(Math.random() * (maxDistance - minDistance + 1)) + minDistance;

    // Randomize mass and friction coefficient for more variability
    // Mass between 1 and 15 kg, rounded to 2 decimal places
    // Friction coefficient between 0.1 and 0.9, rounded to 2 decimal places
    const mass = Math.round((Math.random() * 14 + 1) * 100) / 100;
    const frictionCoefficient =
      Math.round((Math.random() * 0.8 + 0.1) * 100) / 100;

    this.model = new Minigame1SimulModel(
      SIMULATION_CONSTANTS.speed_min, // Initial speed
      frictionCoefficient, // Friction coefficient
      9.8, // Gravity
      distancePixels, // distances
      mass, // Mass
      75, // Gap X
      SIMULATION_CONSTANTS.error_margin, // error margin in pixels
    );

    this.view = new Minigame1SimulView(
      () => this.playSimulation(),
      () => this.resetSimulation(),
      () => this.handleReferenceClick(),
      this.model.getDistanceX(),
      this.model.getMass(),
      this.model.getFrictionCoefficient(),
      this.model.getInitialSpeed(),
      this.model.getGapX(),
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
    // Update distance arrows back to start state (if supported by view)
    (this.view as any).updateArrows?.(box.x());
    this.view.getGroup().getLayer()?.draw();

    // After reset, allow playing again
    this.view.hideResetButton();
    if (this.lives > 0) this.view.showPlayButton();
  }

  handleReferenceClick(): void {
    this.screenSwitcher.switchToScreen({
      type: "reference",
      returnTo: { type: "minigame", screen: "simulation", level: this.level },
    });
  }
  playSimulation(): void {
    if (this.lives <= 0) {
      console.log("No lives left. Game over.");
      return;
    }

    const initialSpeedValue = this.model.getInitialSpeed();
    if (initialSpeedValue <= 0) {
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

    const animation = new Konva.Animation((frame) => {
      if (!frame) return;
      const t = (frame.time / 1000) * SIMULATION_CONSTANTS.speed_multiplier;

      const distance = initialSpeed * t + 0.5 * acceleration * t * t;
      const currentVelocity = initialSpeed + acceleration * t;

      this.view.updateCurrentSpeed(currentVelocity);
      const proposedX = initialX + distance;
      const maxX = STAGE_WIDTH - box.width();
      if (proposedX >= maxX) {
        // Clamp to right edge and end the turn
        box.x(maxX);
        (this.view as any).updateArrows?.(box.x());
        animation.stop();
        this.view.updateCurrentSpeed(0);
        const finalDistance = box.x() - initialX;
        console.log(`Final Distance (edge): ${finalDistance.toFixed(2)} m`);
        this.handleHit(this.model.isHit(finalDistance));
        return;
      }
      box.x(proposedX);
      // Update distance arrows as the box moves
      (this.view as any).updateArrows?.(box.x());

      // Stop animation when the box stops
      if (currentVelocity <= 0) {
        animation.stop();
        this.view.updateCurrentSpeed(0);
        const finalDistance = box.x() - initialX;
        console.log(`Final Distance: ${finalDistance.toFixed(2)} m`);
        this.handleHit(this.model.isHit(finalDistance));
      }
    }, this.view.getGroup().getLayer());

    animation.start();
  }

  getView(): Minigame1SimulView {
    return this.view;
  }
}
