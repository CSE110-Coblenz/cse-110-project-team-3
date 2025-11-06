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
    this.model = new MinigameSimulModel(75.22, 60, 9.8, 500);
    this.view = new MinigameSimulView(
      () => this.playSimulation(),
      this.model.getDistanceX(),
    );
  }

  playSimulation(): void {
    const projectile = this.view.getProjectile();
    projectile.show();
    const initialSpeed = this.model.getInitialSpeed();
    const angle = this.model.getAngle();
    const gravity = this.model.getGravity();
    const distanceX = this.model.getDistanceX();

    const angleInRadians = (angle * Math.PI) / 180;
    const initialX = projectile.x();
    const initialY = projectile.y();

    const animation = new Konva.Animation((frame) => {
      if (!frame) return;
      const t = (frame.time / 1000) * SIMULATION_CONSTANTS.speed_multiplier;

      const x = initialX + initialSpeed * Math.cos(angleInRadians) * t;
      const y =
        initialY -
        (initialSpeed * Math.sin(angleInRadians) * t - 0.5 * gravity * t * t);

      projectile.position({ x, y });

      // Stop animation when it hits the ground or exceeds distanceX
      if (y > SIMULATION_CONSTANTS.ground_level || x > initialX + distanceX) {
        animation.stop();
      }
    }, this.view.getGroup().getLayer());

    animation.start();
  }

  getView(): MinigameSimulView {
    return this.view;
  }
}
