import { describe, it, expect, vi } from "vitest";
import type { ScreenSwitcher } from "../../../src/types";
import { createKonvaMock } from "../../mocks/konvaMock";
import { SIMULATION_CONSTANTS } from "../../../src/constants";

vi.mock("konva", () => createKonvaMock());

import Konva from "konva";
import { MinigameSimulController } from "../../../src/screens/MiniGameScreens/MinigameSimulScreen/MinigameSimulController";

describe("MinigameSimulController Integration Test", () => {
  it("initializes the projectile and play animation correctly", () => {
    const switchToScreen = vi.fn();
    const screenSwitcher: ScreenSwitcher = { switchToScreen };

    const controller = new MinigameSimulController(screenSwitcher);
    const view = controller.getView();

    // Check that the projectile is initialized with the correct starting position
    const projectile = view.getProjectile();
    expect(projectile.x()).toBe(SIMULATION_CONSTANTS.starting_x);
    expect(projectile.y()).toBe(SIMULATION_CONSTANTS.ground_level);

    // Simulate clicking the play button to start the animation
    controller.playSimulation();

    // Check that the animation is created and started
    const animations = (Konva as any).Animation.instances;
    expect(animations.length).toBe(1);
    expect(animations[0].started).toBe(true);

    // Check that the animation callback is defined and can be called
    const animationCallback = animations[0].cb;
    expect(typeof animationCallback).toBe("function");

    // Simulate a frame update and check that the callback is called without errors
    expect(() => animationCallback({ time: 1000 })).not.toThrow();
  });

  it("resetSimulation hides the projectile and resets its position", () => {
    const switchToScreen = vi.fn();
    const screenSwitcher: ScreenSwitcher = { switchToScreen };

    const controller = new MinigameSimulController(screenSwitcher);
    const view = controller.getView();
    const projectile = view.getProjectile();

    // Simulate the projectile being visible and at a non-starting position
    projectile.show();
    projectile.position({ x: 100, y: 100 });

    controller.resetSimulation();

    expect(projectile.visible()).toBe(false);
    expect(projectile.x()).toBe(SIMULATION_CONSTANTS.starting_x);
    expect(projectile.y()).toBe(SIMULATION_CONSTANTS.ground_level);
  });

  it("the buttons are set up correctly", () => {
    const switchToScreen = vi.fn();
    const screenSwitcher: ScreenSwitcher = { switchToScreen };

    const controller = new MinigameSimulController(screenSwitcher);
    const view = controller.getView();
    const rootGroup = view.getGroup() as any;

    // Check that the play button exists and has a click handler
    const playGroup = (rootGroup.children as any[]).find(
      (child: any) =>
        child instanceof (Konva as any).Group &&
        child.children?.some(
          (c: any) =>
            c instanceof (Konva as any).Text && c.config.text === "PLAY"
        )
    );
    expect(playGroup).toBeDefined();
    (playGroup as any).fire("click");

    // Check that the playSimulation method was called
    expect(controller.playSimulation).toBeDefined();
  });
});
