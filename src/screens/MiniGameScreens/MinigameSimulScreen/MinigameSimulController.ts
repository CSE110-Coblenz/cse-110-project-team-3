import Konva from "konva";
import { SIMULATION_CONSTANTS, STAGE_WIDTH } from "../../../constants";
import type { ScreenSwitcher } from "../../../types";
import { MinigameController } from "../../../types";
import { MinigameSimulModel } from "./MinigameSimulModel";
import { MinigameSimulView } from "./MinigameSimulView";
import { getMinigameSimulScreenNavigationButtons } from "../../../configs/NavigationButtons/MiniGame";

/**
 * Controller for the projectile minigame simulation
 * Coordinates model, view, randomized targets, and navigation,
 * handling play/reset flow and hit detection.
 */
export class MinigameSimulController extends MinigameController {
  private view: MinigameSimulView;
  private model: MinigameSimulModel;
  private cannonFire: HTMLAudioElement;

  constructor(screenSwitcher: ScreenSwitcher, level: number) {
    super(screenSwitcher, level);

    // Randomize target distance each game so the problem varies
    const targetHalfWidth = 15;
    const maxDistance = Math.max(
      100,
      Math.floor(
        STAGE_WIDTH - SIMULATION_CONSTANTS.starting_x + targetHalfWidth - 20,
      ),
    );
    const minDistance = SIMULATION_CONSTANTS.simulation_min_distance_to_target;
    const distanceX = Math.max(
      minDistance,
      Math.min(
        maxDistance,
        Math.floor(Math.random() * (maxDistance - minDistance + 1)) +
          minDistance,
      ),
    );

    this.model = new MinigameSimulModel(
      SIMULATION_CONSTANTS.projectile_speed_min,
      SIMULATION_CONSTANTS.angle_min,
      9.8,
      distanceX,
      0,
      SIMULATION_CONSTANTS.error_margin,
    );

    // Create navigation buttons with level
    const navigationButtons = getMinigameSimulScreenNavigationButtons(level);

    // Create view with navigation buttons and click handler
    this.view = new MinigameSimulView(
      () => this.playSimulation(),
      () => this.resetSimulation(),
      this.model.getDistanceX(),
      this.model.getInitialHeight(),
      this.model.getInitialSpeed(),
      this.model.getAngle(),
      this.model.getGravity(),
      (delta) => this.adjustSpeed(delta),
      (delta) => this.adjustAngle(delta),
      navigationButtons,
      (buttonId) => {
        const button = navigationButtons.find((b) => b.id === buttonId);
        if (button) {
          console.log(`MinigameSimulScreen: ${button.label} clicked`);
          this.screenSwitcher.switchToScreen(button.target);
        }
      },
    );

    //Initialize cannon fire sound
    this.cannonFire = new Audio("/explosion_sound.mp3");
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
  }

  playSimulation(): void {
    if (this.lives <= 0) {
      console.log("No lives left. Game over.");
      return;
    }
    // Play cannon fire sound
    this.cannonFire.play();
    this.cannonFire.currentTime = 0;

    const projectile = this.view.getProjectile();
    projectile.show();
    const initialSpeed = this.model.getInitialSpeed();
    const angle = this.model.getAngle();
    const gravity = this.model.getGravity();
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

      // Stop animation when it goes off screen or hits the ground
      if (x > STAGE_WIDTH || y > SIMULATION_CONSTANTS.ground_level) {
        animation.stop();
        this.handleHit(this.model.isHit(x - initialX));
      }
    }, this.view.getGroup().getLayer());

    animation.start();
  }

  getView(): MinigameSimulView {
    return this.view;
  }
}
