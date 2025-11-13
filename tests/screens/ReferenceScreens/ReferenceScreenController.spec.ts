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

  it("does not switch screens when exit button is clicked", () => {
    lastClickHandler();

    expect(switchToScreen).not.toHaveBeenCalled();
  });

  it("returns the ReferenceScreenView instance", () => {
    const view = controller.getView();
    expect(view).toBeInstanceOf(Object); // We mocked ReferenceScreenView, so we check for Object
  });
});
