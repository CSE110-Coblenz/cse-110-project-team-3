import { describe, it, expect, beforeEach, vi } from "vitest";
import type { ScreenSwitcher } from "../../../src/types";
import { createKonvaMock, FakeGroup } from "../../mocks/konvaMock";

// Mock konva BEFORE importing the controller
vi.mock("konva", () => createKonvaMock());

// Minimal fake group and box for testing
class FakeBox {
  private _pos = { x: 0, y: 0 };
  private _visible = true;

  position(pos?: { x: number; y: number }) {
    if (pos) {
      this._pos = pos;
    }
    return this._pos;
  }

  x(v?: number) {
    if (typeof v === "number") {
      this._pos.x = v;
    }
    return this._pos.x;
  }

  y(v?: number) {
    if (typeof v === "number") {
      this._pos.y = v;
    }
    return this._pos.y;
  }

  show() {
    this._visible = true;
  }

  hide() {
    this._visible = false;
  }

  visible() {
    return this._visible;
  }
}

class FakeModel {
  initialSpeed = 10;
  mu = 0.3;
  g = 9.8;
  distanceX = 200;
  mass = 1;
  gapX = 75;

  getInitialSpeed() {
    return this.initialSpeed;
  }
  setInitialSpeed(v: number) {
    this.initialSpeed = v;
  }
  getFrictionCoefficient() {
    return this.mu;
  }
  getGravity() {
    return this.g;
  }
  getDistanceX() {
    return this.distanceX;
  }
  getMass() {
    return this.mass;
  }
  getGapX() {
    return this.gapX;
  }
  isHit(distance: number) {
    return distance >= this.distanceX && distance <= this.distanceX + this.gapX;
  }
}

// A minimal fake view that just records calls
class FakeView {
  group = new FakeGroup();
  box = new FakeBox();

  hideResetButton = vi.fn();
  showPlayButton = vi.fn();
  hidePlayButton = vi.fn();
  hideCurrentSpeedText = vi.fn();
  showCurrentSpeedText = vi.fn();
  updateCurrentSpeed = vi.fn();
  setSpeedDisplay = vi.fn();

  onPlay?: () => void;
  onReset?: () => void;
  onAdjustSpeed?: (delta: number) => void;

  constructor() {}

  getGroup() {
    return this.group;
  }

  getBox() {
    return this.box;
  }
}

const fakeModel = new FakeModel();
const fakeView = new FakeView();

// Mock model module
vi.mock(
  "../../../src/screens/MiniGameScreens/Minigame1SimulScreen/Minigame1SimulModel",
  () => {
    // This is a *constructible* function, not an arrow
    function FakeMinigame1SimulModel(
      _initialSpeed: number,
      _mu: number,
      _g: number,
      distancePixels: number,
      _mass: number,
      _gapX: number,
      _errorMargin: number,
    ) {
      // sync the singleton fakeModel with constructor args
      fakeModel.distanceX = distancePixels;
      fakeModel.mu = _mu;
      fakeModel.g = _g;
      fakeModel.gapX = _gapX;
      return fakeModel; // returning an object from a constructor is allowed
    }

    return {
      Minigame1SimulModel: vi.fn(FakeMinigame1SimulModel),
    };
  },
);

// Mock view module
vi.mock(
  "../../../src/screens/MiniGameScreens/Minigame1SimulScreen/Minigame1SimulView",
  () => {
    function FakeMinigame1SimulView(
      onPlay: () => void,
      onReset: () => void,
      _distanceX: number,
      _mass: number,
      _mu: number,
      initialSpeed: number,
      _gapX: number,
      adjustSpeed: (delta: number) => void,
      _navigationButtons: any,
      _onButtonClick: any,
    ) {
      fakeView.onPlay = onPlay;
      fakeView.onReset = onReset;
      fakeView.onAdjustSpeed = adjustSpeed;
      fakeModel.initialSpeed = initialSpeed;
      return fakeView;
    }

    return {
      Minigame1SimulView: vi.fn(FakeMinigame1SimulView),
    };
  },
);

import { Minigame1SimulController } from "../../../src/screens/MiniGameScreens/Minigame1SimulScreen/Minigame1SimulController";
import { SIMULATION_CONSTANTS, STAGE_WIDTH } from "../../../src/constants";

describe("Minigame1SimulController", () => {
  let controller: Minigame1SimulController;
  const switchToScreen = vi.fn();

  beforeEach(() => {
    switchToScreen.mockClear();

    const screenSwitcher: ScreenSwitcher = {
      switchToScreen,
    };

    controller = new Minigame1SimulController(screenSwitcher, 1);
  });

  it("initializes the view with the correct parameters", () => {
    expect(fakeView.onPlay).toBeDefined();
    expect(fakeView.onReset).toBeDefined();
    expect(fakeView.onAdjustSpeed).toBeDefined();

    const d = fakeModel.getDistanceX();
    const minDistance = SIMULATION_CONSTANTS.simulation_min_distance_to_target;
    const maxDistance = STAGE_WIDTH - SIMULATION_CONSTANTS.starting_x - 100;

    expect(d).toBeGreaterThanOrEqual(minDistance);
    expect(d).toBeLessThanOrEqual(maxDistance);
  });

  it("resets the simulation correctly when onReset is called", () => {
    const box = fakeView.getBox();
    box.position({ x: 999, y: 999 }); // set to non-starting position
    fakeView.showCurrentSpeedText.mockClear();
    fakeView.hideResetButton.mockClear();
    fakeView.showPlayButton.mockClear();

    controller.resetSimulation();

    expect(box.position()).toEqual({
      x: SIMULATION_CONSTANTS.starting_x,
      y: SIMULATION_CONSTANTS.ground_level - 50,
    });
    expect(fakeView.hideCurrentSpeedText).toHaveBeenCalled();
    expect(fakeView.hideResetButton).toHaveBeenCalled();
    expect(fakeView.showPlayButton).toHaveBeenCalled();
  });

  it("plays the simulation when onPlay is called", () => {
    controller.playSimulation();

    expect(fakeView.hidePlayButton).toHaveBeenCalled();
    expect(fakeView.showCurrentSpeedText).toHaveBeenCalled();
  });
});
