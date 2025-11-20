import { describe, it, expect, beforeEach, vi } from "vitest";
import type { ScreenSwitcher } from "../../../src/types";
import { RulesScreenController } from "../../../src/screens/RulesScreen/RulesScreenController";

let lastClickHandler: any;

vi.mock("../../../src/screens/RulesScreen/RulesScreenView", () => {
  class FakeRulesScreenView {
    constructor(clickHandler: any) {
      lastClickHandler = clickHandler;
    }
  }

  return {
    RulesScreenView: FakeRulesScreenView,
  };
});

describe("RulesScreenController", () => {
  const switchToScreen = vi.fn();
  let controller: RulesScreenController;

  beforeEach(() => {
    switchToScreen.mockClear();

    const screenSwitcher: ScreenSwitcher = {
      switchToScreen,
    };

    controller = new RulesScreenController(screenSwitcher);
  });

  it("switches to map screen when exit button is clicked", () => {
    lastClickHandler();

    expect(switchToScreen).toHaveBeenCalledTimes(1);
    expect(switchToScreen).toHaveBeenCalledWith({ type: "map" });
  });
});
