import { describe, it, expect, beforeEach, vi } from "vitest";
import type { ScreenSwitcher } from "../../../src/types";
import { SimulationScreenController } from "../../../src/screens/SimulationScreen/SimulationScreenController";

let lastBackClickHandler: any;
let lastNextClickHandler: any;

vi.mock("../../../src/screens/SimulationScreen/SimulationScreenView", () => {
  class FakeSimulationScreenView {
    constructor(level: any, backClickHandler: any, nextClickHandler: any) {
      lastBackClickHandler = backClickHandler;
      lastNextClickHandler = nextClickHandler;
    }
  }

  return {
    SimulationScreenView: FakeSimulationScreenView,
  };
});

describe("SimulationScreenController", () => {
  const switchToScreen = vi.fn();
  let controller: SimulationScreenController;

  beforeEach(() => {
    switchToScreen.mockClear();

    const screenSwitcher: ScreenSwitcher = {
      switchToScreen,
    };

    controller = new SimulationScreenController(screenSwitcher, {
      level: "lev1",
      topic: "friction",
    });
  });

  it("switches to topic screen when back button is clicked", () => {
    lastBackClickHandler();

    expect(switchToScreen).toHaveBeenCalledTimes(1);
    expect(switchToScreen).toHaveBeenCalledWith({
      type: "topic",
      level: "friction",
    });
  });

  it("does not switch screens when next button is clicked", () => {
    lastNextClickHandler();

    expect(switchToScreen).not.toHaveBeenCalled();
  });
});
