import { describe, it, expect, beforeEach, vi } from "vitest";
import type { ScreenSwitcher } from "../../../src/types";
import { ReferenceScreenController } from "../../../src/screens/ReferenceScreens/ReferenceScreenController";

let lastClickHandler: any;

vi.mock("../../../src/screens/ReferenceScreens/ReferenceScreenView", () => {
  class FakeReferenceScreenView {
    constructor(clickHandler: any) {
      lastClickHandler = clickHandler;
    }
  }

  return {
    ReferenceScreenView: FakeReferenceScreenView,
  };
});

describe("ReferenceScreenController", () => {
  const switchToScreen = vi.fn();
  let controller: ReferenceScreenController;

  beforeEach(() => {
    switchToScreen.mockClear();

    const screenSwitcher: ScreenSwitcher = {
      switchToScreen,
    };

    controller = new ReferenceScreenController(screenSwitcher);
  });

  it("switches to map screen when exit button is clicked", () => {
    lastClickHandler();

    expect(switchToScreen).toHaveBeenCalledWith({ type: "map" });
  });

  it("switches to the screen specified by setReturnTo when exit button is clicked", () => {
    const minigameScreen = { type: "minigame", level: 1 };
    controller.setReturnTo(minigameScreen);
    lastClickHandler();

    expect(switchToScreen).toHaveBeenCalledWith(minigameScreen);
  });
});
