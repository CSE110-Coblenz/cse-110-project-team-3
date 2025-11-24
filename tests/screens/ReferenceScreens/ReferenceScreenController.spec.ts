import { describe, it, expect, beforeEach, vi } from "vitest";
import type { ScreenSwitcher } from "../../../src/types";
import { ReferenceScreenController } from "../../../src/screens/ReferenceScreens/ReferenceScreenController";

let lastButtonClickHandler: (buttonId: string) => void;

vi.mock("../../../src/screens/ReferenceScreens/ReferenceScreenView", () => {
  class FakeReferenceScreenView {
    constructor(clickHandler: (buttonId: string) => void) {
      lastButtonClickHandler = clickHandler;
    }

    getGroup() {
      return {};
    }

    show() {}
    hide() {}
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

  it("switches to map screen when exit button is clicked by default", () => {
    lastButtonClickHandler("exit");

    expect(switchToScreen).toHaveBeenCalledTimes(1);
    expect(switchToScreen).toHaveBeenCalledWith({ type: "map" });
  });

  it("switches to the screen specified by setReturnTo when exit button is clicked", () => {
    const minigameScreen = {
      type: "minigame" as const,
      screen: "simulation" as const,
      level: 1,
    };
    controller.setReturnTo(minigameScreen);
    lastButtonClickHandler("exit");

    expect(switchToScreen).toHaveBeenCalledTimes(1);
    expect(switchToScreen).toHaveBeenCalledWith(minigameScreen);
  });

  it("switches to topic screen when setReturnTo is set to topic", () => {
    const topicScreen = { type: "topic" as const, level: "friction" as const };
    controller.setReturnTo(topicScreen);
    lastButtonClickHandler("exit");

    expect(switchToScreen).toHaveBeenCalledTimes(1);
    expect(switchToScreen).toHaveBeenCalledWith(topicScreen);
  });

  it("does nothing when clicking a non-existent button", () => {
    switchToScreen.mockClear();
    lastButtonClickHandler("non-existent-button");

    // Non-existent buttons should not navigate anywhere
    expect(switchToScreen).not.toHaveBeenCalled();
  });
});
