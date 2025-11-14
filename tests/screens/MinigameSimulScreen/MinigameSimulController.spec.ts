import { describe, it, expect, beforeEach, vi } from "vitest";
import { SIMULATION_CONSTANTS } from "../../../src/constants";
import type { ScreenSwitcher } from "../../../src/types";

let lastCreatedView: any;
let animationInstances: any[] = [];

// ---- Mock Konva just for Animation ----
vi.mock("konva", () => {
  class FakeAnimation {
    cb: (frame: { time: number }) => void;
    layer: any;
    started = false;
    stopped = false;

    constructor(cb: (frame: { time: number }) => void, layer: any) {
      this.cb = cb;
      this.layer = layer;
      animationInstances.push(this);
    }

    start() {
      this.started = true;
    }

    stop() {
      this.stopped = true;
    }
  }

  return {
    default: {
      Animation: FakeAnimation,
    },
  };
});

// ---- Mock MinigameSimulView ----
vi.mock(
  "../../../src/screens/MiniGameScreens/MinigameSimulScreen/MinigameSimulView",
  () => {
    class FakeProjectile {
      xVal = SIMULATION_CONSTANTS.starting_x;
      yVal = SIMULATION_CONSTANTS.ground_level;
      hidden = true;

      lastPosition: { x: number; y: number } | null = null;

      x() {
        return this.xVal;
      }

      position(pos: { x: number; y: number }) {
        this.xVal = pos.x;
        this.yVal = pos.y;
        this.lastPosition = pos;
      }

      hide() {
        this.hidden = true;
      }

      show() {
        this.hidden = false;
      }
    }

    class FakeLayer {
      drawCalled = false;
      draw() {
        this.drawCalled = true;
      }
    }

    class FakeGroup {
      layer: FakeLayer;
      constructor(layer: FakeLayer) {
        this.layer = layer;
      }
      getLayer() {
        return this.layer;
      }
    }

    class FakeMinigameSimulView {
      projectile: FakeProjectile;
      layer: FakeLayer;
      group: FakeGroup;

      removePlayButtonCalled = false;
      addResetButtonCalled = false;

      constructor(
        onPlay: () => void,
        onReset: () => void,
        _distanceX: number,
        _initialHeight: number,
        _initialSpeed: number,
        _angle: number,
        _gravity: number,
      ) {
        this.projectile = new FakeProjectile();
        this.layer = new FakeLayer();
        this.group = new FakeGroup(this.layer);

        // tests can call these later if they want
        this.onPlay = onPlay;
        this.onReset = onReset;

        lastCreatedView = this;
      }

      onPlay: () => void;
      onReset: () => void;

      getProjectile() {
        return this.projectile;
      }

      getGroup() {
        return this.group;
      }

      removePlayButton() {
        this.removePlayButtonCalled = true;
      }

      addResetButton() {
        this.addResetButtonCalled = true;
      }
    }

    return {
      MinigameSimulView: FakeMinigameSimulView,
    };
  },
);

import { MinigameSimulController } from "../../../src/screens/MiniGameScreens/MinigameSimulScreen/MinigameSimulController";

describe("MinigameSimulController", () => {
  let controller: MinigameSimulController;
  const switchToScreen = vi.fn();

  beforeEach(() => {
    animationInstances = [];
    switchToScreen.mockClear();

    const screenSwitcher: ScreenSwitcher = { switchToScreen };

    controller = new MinigameSimulController(screenSwitcher);
  });

  it("resetSimulation hides projectile, resets position, and redraws layer", () => {
    const view = lastCreatedView;
    const projectile = view.getProjectile();
    const layer = view.getGroup().getLayer();

    // sanity: start in a non-reset state
    projectile.show();
    projectile.position({ x: 999, y: 999 });

    controller.resetSimulation();

    expect(projectile.hidden).toBe(true);
    expect(projectile.lastPosition).toEqual({
      x: SIMULATION_CONSTANTS.starting_x,
      y:
        SIMULATION_CONSTANTS.ground_level -
        // initialHeight passed to the view in controller constructor (500? 0?),
        // but in your controller it's this.model.getInitialHeight()
        // which you initialize as 0, so:
        0,
    });
    expect(layer.drawCalled).toBe(true);
  });

  it("playSimulation shows projectile and starts an animation", () => {
    const view = lastCreatedView;
    const projectile = view.getProjectile();

    expect(projectile.hidden).toBe(true);

    controller.playSimulation();

    expect(projectile.hidden).toBe(false);
    expect(animationInstances.length).toBe(1);
    expect(animationInstances[0].started).toBe(true);
  });

  it("animation callback updates buttons when projectile hits ground", () => {
    controller.playSimulation();

    const view = lastCreatedView;
    const anim = animationInstances[0];

    // simulate a late frame: time big ⇒ t big ⇒ y > ground ⇒ stop + hit check
    anim.cb({ time: 999999 });

    expect(view.removePlayButtonCalled).toBe(true);
    expect(view.addResetButtonCalled).toBe(true);
    expect(anim.stopped).toBe(true);
  });
});
