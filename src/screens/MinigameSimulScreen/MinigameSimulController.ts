import Konva from "konva";
import { SIMULATION_CONSTANTS } from "../../constants";
import type { ScreenSwitcher } from "../../types";
import { ScreenController } from "../../types";
import { MinigameSimulModel } from "./MinigameSimulModel";
import { MinigameSimulView } from "./MinigameSimulView";

export class MinigameSimulController extends ScreenController {
  private view: MinigameSimulView;
  private screenSwitcher: ScreenSwitcher;
  private model: MinigameSimulModel;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.screenSwitcher = screenSwitcher;
    this.model = new MinigameSimulModel(
      75.22,
      60,
      9.8,
      500,
      0,
      SIMULATION_CONSTANTS.error_margin,
    );
    this.view = new MinigameSimulView(
      () => this.playSimulation(),
      () => this.resetSimulation(),
      this.model.getDistanceX(),
      this.model.getInitialHeight(),
      this.model.getInitialSpeed(),
      this.model.getAngle(),
      this.model.getGravity(),
    );
  }

  resetSimulation(): void {
    const projectile = this.view.getProjectile();
    projectile.hide();
    projectile.position({
      x: SIMULATION_CONSTANTS.starting_x,
      y: SIMULATION_CONSTANTS.ground_level - this.model.getInitialHeight(),
    });
    this.view.getGroup().getLayer()?.draw();
    console.log("Simulation reset.");
  }

  playSimulation(): void {
    const projectile = this.view.getProjectile();
    projectile.show();
    const initialSpeed = this.model.getInitialSpeed();
    const angle = this.model.getAngle();
    const gravity = this.model.getGravity();
    const distanceX = this.model.getDistanceX();
    const initialHeight = this.model.getInitialHeight();

    const angleInRadians = (angle * Math.PI) / 180;
    const initialX = projectile.x();

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

      // Stop animation when it hits the ground or exceeds distanceX
      if (y > SIMULATION_CONSTANTS.ground_level) {
        animation.stop();
        console.log("x", x);
        console.log("distance_X", initialX + distanceX);
        if (this.model.isHit(x - initialX)) {
          console.log("Hit the target!");
          // TODO: Add a success handler or callback here
        } else {
          console.log("Missed the target.");
          // TODO: Add a failure handler or callback here
        }
        this.view.removePlayButton();
        this.view.addResetButton();
      }
    }, this.view.getGroup().getLayer());

    animation.start();
  }

  getView(): MinigameSimulView {
    return this.view;
  }
}
