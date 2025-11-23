import { describe, it, expect, beforeEach, vi } from "vitest";
import type { ScreenSwitcher } from "../../../src/types";
import { RulesScreenController } from "../../../src/screens/RulesScreen/RulesScreenController";

let lastButtonClickHandler: (buttonId: string) => void;

vi.mock("../../../src/screens/RulesScreen/RulesScreenView", () => {
  class FakeRulesScreenView {
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

  it("switches to map screen when exit button is clicked by default", () => {
    lastButtonClickHandler("exit");

    expect(switchToScreen).toHaveBeenCalledTimes(1);
    expect(switchToScreen).toHaveBeenCalledWith({ type: "map" });
  });

  it("switches to custom return screen when set via setReturnTo", () => {
    const customScreen = { type: "topic" as const, level: "friction" as const };
    controller.setReturnTo(customScreen);

    lastButtonClickHandler("exit");

    expect(switchToScreen).toHaveBeenCalledTimes(1);
    expect(switchToScreen).toHaveBeenCalledWith(customScreen);
  });

  it("switches to minigame screen when setReturnTo is set to minigame", () => {
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

  it("does nothing when clicking a non-existent button", () => {
    switchToScreen.mockClear();
    lastButtonClickHandler("non-existent-button");

    // Non-existent buttons should not trigger navigation
    expect(switchToScreen).not.toHaveBeenCalled();
  });
});
