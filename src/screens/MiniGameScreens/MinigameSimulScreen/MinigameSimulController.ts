import Konva from "konva";
import { SIMULATION_CONSTANTS, STAGE_WIDTH } from "../../../constants";
import type { ScreenSwitcher } from "../../../types";
import { ScreenController } from "../../../types";
import { MinigameSimulModel } from "./MinigameSimulModel";
import { MinigameSimulView } from "./MinigameSimulView";

export class MinigameSimulController extends ScreenController {
  private view: MinigameSimulView;
  private screenSwitcher: ScreenSwitcher;
  private model: MinigameSimulModel;
  private lives: number = 3;
  private level: number;

  constructor(screenSwitcher: ScreenSwitcher, level: number) {
    super();
    this.screenSwitcher = screenSwitcher;
    // Randomize target distance each game so the problem varies
    const targetHalfWidth = 15;
    const maxDistance = Math.max(
      100,
      Math.floor(
        STAGE_WIDTH - SIMULATION_CONSTANTS.starting_x + targetHalfWidth - 20,
      ),
    );
    const minDistance = 200;
    const distanceX = Math.max(
      minDistance,
      Math.min(
        maxDistance,
        Math.floor(Math.random() * (maxDistance - minDistance + 1)) +
          minDistance,
      ),
    );
    this.level = level;

    this.model = new MinigameSimulModel(
      0,
      0,
      9.8,
      distanceX,
      0,
      SIMULATION_CONSTANTS.error_margin,
    );
    this.view = new MinigameSimulView(
      () => this.playSimulation(),
      () => this.resetSimulation(),
      () => this.handleReferenceClick(),
      this.model.getDistanceX(),
      this.model.getInitialHeight(),
      this.model.getInitialSpeed(),
      this.model.getAngle(),
      this.model.getGravity(),
      (delta) => this.adjustSpeed(delta),
      (delta) => this.adjustAngle(delta),
    );
  }

  private adjustSpeed(delta: number): void {
    const current = this.model.getInitialSpeed();
    this.model.setInitialSpeed(current + delta);
    this.view.setSpeedDisplay(this.model.getInitialSpeed());
  }

  private adjustAngle(delta: number): void {
    const current = this.model.getAngle();
    this.model.setAngle(current + delta);
    this.view.setAngleDisplay(this.model.getAngle());
  }

  resetSimulation(): void {
    const projectile = this.view.getProjectile();
    projectile.hide();
    projectile.position({
      x: SIMULATION_CONSTANTS.starting_x,
      y: SIMULATION_CONSTANTS.ground_level - this.model.getInitialHeight(),
    });
    this.view.getGroup().getLayer()?.draw();
    // After reset, allow playing again
    this.view.hideResetButton();
    if (this.lives > 0) this.view.showPlayButton();
    console.log("Simulation reset.");
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
    const projectile = this.view.getProjectile();
    projectile.show();
    const initialSpeed = this.model.getInitialSpeed();
    const angle = this.model.getAngle();
    const gravity = this.model.getGravity();
    const distanceX = this.model.getDistanceX();
    const initialHeight = this.model.getInitialHeight();

    const angleInRadians = (angle * Math.PI) / 180;
    const initialX = projectile.x();

    // Hide play to prevent multiple concurrent plays
    this.view.hidePlayButton();

    const animation = new Konva.Animation((frame) => {
      if (!frame) return;
      const t = (frame.time / 1000) * SIMULATION_CONSTANTS.speed_multiplier;

      const x = initialX + initialSpeed * Math.cos(angleInRadians) * t;
      const y =
        SIMULATION_CONSTANTS.ground_level -
        (initialHeight +
          initialSpeed * Math.sin(angleInRadians) * t -
          0.5 * gravity * t * t);

      projectile.position({ x, y });

      // Stop animation when it hits the ground
      if (y > SIMULATION_CONSTANTS.ground_level) {
        animation.stop();
        console.log("x", x);
        console.log("distance_X", initialX + distanceX);
        if (this.model.isHit(x - initialX)) {
          console.log("Hit the target!");
          // Success: keep lives unchanged, prompt reset for next round
          this.screenSwitcher.switchToScreen({
            type: "minigame",
            screen: "completed",
            level: this.level,
          });
        } else {
          console.log("Missed the target.");
          // Lose a life on miss
          this.lives = Math.max(0, this.lives - 1);
          this.view.setLives(this.lives);
          if (this.lives <= 0) {
            console.log("Game Over");
            this.screenSwitcher.switchToScreen({
              type: "minigame",
              screen: "gameover",
              level: this.level,
            });
            return;
          }
        }

        // Show reset to reposition the projectile; play becomes available after reset (if lives remain)
        this.view.addResetButton();
      }
    }, this.view.getGroup().getLayer());

    animation.start();
  }

  getView(): MinigameSimulView {
    return this.view;
  }
}
