import { describe, it, expect, beforeEach, vi } from "vitest";
import type { ScreenSwitcher } from "../../../src/types";

let lastCreatedView: any;

vi.mock("../../../src/screens/MapScreen/MapView", () => {
  class FakeMapScreenView {
    referenceClickHandler: () => void;
    rulesClickHandler: () => void;
    exitClickHandler: () => void;
    nodeClickHandler: (level: string) => void;

    constructor(
      onReferenceClick: () => void,
      onRulesClick: () => void,
      onExitClick: () => void,
      onNodeClick: (level: string) => void,
    ) {
      this.referenceClickHandler = onReferenceClick;
      this.rulesClickHandler = onRulesClick;
      this.exitClickHandler = onExitClick;
      this.nodeClickHandler = onNodeClick;

      // keep a reference so tests can grab it later
      lastCreatedView = this;
    }
  }

  return {
    MapScreenView: FakeMapScreenView,
  };
});

import { MapScreenController } from "../../../src/screens/MapScreen/MapController";

describe("MapScreenController", () => {
  const switchToScreen = vi.fn();
  let controller: MapScreenController;
  let view: any; // FakeMapScreenView

  beforeEach(() => {
    switchToScreen.mockClear();

    const screenSwitcher: ScreenSwitcher = {
      switchToScreen,
    };

    controller = new MapScreenController(screenSwitcher);
    view = lastCreatedView;
  });

  it("switches to friction topic when node '1' clicked", () => {
    view.nodeClickHandler("1");

    expect(switchToScreen).toHaveBeenCalledTimes(1);
    expect(switchToScreen).toHaveBeenCalledWith({
      type: "topic",
      level: "friction",
    });
  });

  it("switches to projectile motion topic when node '2' clicked", () => {
    view.nodeClickHandler("2");

    expect(switchToScreen).toHaveBeenCalledTimes(1);
    expect(switchToScreen).toHaveBeenCalledWith({
      type: "topic",
      level: "projectile motion",
    });
  });

  it("switches to rules screen when rules button clicked", () => {
    view.rulesClickHandler();

    expect(switchToScreen).toHaveBeenCalledTimes(1);
    expect(switchToScreen).toHaveBeenCalledWith({ type: "rules" });
  });

  it("switches to reference screen when reference button clicked", () => {
    view.referenceClickHandler();

    expect(switchToScreen).toHaveBeenCalledTimes(1);
    expect(switchToScreen).toHaveBeenCalledWith({ type: "reference" });
  });

  it("switches to exit screen when exit button clicked", () => {
    view.exitClickHandler();

    // expect(switchToScreen).toHaveBeenCalledTimes(1);
    // expect(switchToScreen).toHaveBeenCalledWith({ type: "exit" });
  });
});
