import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ScreenSwitcher } from "../../../src/types";
import {
  createKonvaMock,
  FakeAnimation,
  FakeGroup,
  FakeText,
} from "../../mocks/konvaMock";
import { SIMULATION_CONSTANTS } from "../../../src/constants";

vi.mock("konva", () => createKonvaMock());

import { MinigameSimulController } from "../../../src/screens/MiniGameScreens/MinigameSimulScreen/MinigameSimulController";

describe("MinigameSimulController Integration Test", () => {
  beforeEach(() => {
    FakeAnimation.instances = [];
  });

  it("initializes the projectile and play animation correctly", () => {
    const switchToScreen = vi.fn();
    const screenSwitcher: ScreenSwitcher = { switchToScreen };

    const controller = new MinigameSimulController(screenSwitcher, 2);
    const view = controller.getView();

    // Check that the projectile is initialized with the correct starting position
    const projectile = view.getProjectile();
    expect(projectile.x()).toBe(SIMULATION_CONSTANTS.starting_x);
    // The initial height is 0 in the controller's model
    expect(projectile.y()).toBe(SIMULATION_CONSTANTS.ground_level - 0);

    // Simulate clicking the play button to start the animation
    controller.playSimulation();

    // Check that the animation is created and started
    const animations = FakeAnimation.instances;
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

    const controller = new MinigameSimulController(screenSwitcher, 2);
    const view = controller.getView();
    const projectile = view.getProjectile();

    // Simulate the projectile being visible and at a non-starting position
    projectile.show();
    projectile.position({ x: 100, y: 100 });

    controller.resetSimulation();

    expect(projectile.visible()).toBe(false);
    expect(projectile.x()).toBe(SIMULATION_CONSTANTS.starting_x);
    expect(projectile.y()).toBe(SIMULATION_CONSTANTS.ground_level - 0);
  });

  it("the buttons are set up correctly", () => {
    const switchToScreen = vi.fn();
    const screenSwitcher: ScreenSwitcher = { switchToScreen };

    const controller = new MinigameSimulController(screenSwitcher, 2);
    const view = controller.getView();
    const rootGroup = view.getGroup();

    // Check that the play button exists and has a click handler
    const playGroup = rootGroup.children.find(
      (child) =>
        child instanceof FakeGroup &&
        child.children?.some(
          (c) => c instanceof FakeText && c.config.text === "PLAY",
        ),
    );
    expect(playGroup).toBeDefined();
    (playGroup as unknown as FakeGroup).fire("click");

    // Check that the playSimulation method was called
    expect(FakeAnimation.instances.length).toBe(1);
    expect(FakeAnimation.instances[0].started).toBe(true);
  });
});
