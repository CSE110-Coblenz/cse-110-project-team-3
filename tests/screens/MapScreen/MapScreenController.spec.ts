import { describe, it, expect, beforeEach, vi } from "vitest";
import type { ScreenSwitcher, MapScreenConfig } from "../../../src/types";

let lastCreatedView: any;
let lastConfig: MapScreenConfig;
let lastButtonClickHandler: (buttonId: string) => void;
let lastNodeClickHandler: (nodeId: string) => void;

vi.mock("../../../src/screens/MapScreen/MapView", () => {
  class FakeMapScreenView {
    static fromConfig(
      config: MapScreenConfig,
      onButtonClick: (buttonId: string) => void,
      onNodeClick: (nodeId: string) => void,
    ) {
      lastConfig = config;
      lastButtonClickHandler = onButtonClick;
      lastNodeClickHandler = onNodeClick;
      lastCreatedView = new FakeMapScreenView();
      return lastCreatedView;
    }

    getGroup() {
      return {};
    }

    show() {}
    hide() {}
  }

  return {
    MapScreenView: FakeMapScreenView,
  };
});

import { MapScreenController } from "../../../src/screens/MapScreen/MapController";

describe("MapScreenController", () => {
  const switchToScreen = vi.fn();
  let controller: MapScreenController;

  beforeEach(() => {
    switchToScreen.mockClear();

    const screenSwitcher: ScreenSwitcher = {
      switchToScreen,
    };

    controller = new MapScreenController(screenSwitcher, 1);
  });

  it("switches to force topic when node 'level-1' clicked", () => {
    lastNodeClickHandler("level-1");

    expect(switchToScreen).toHaveBeenCalledTimes(1);
    expect(switchToScreen).toHaveBeenCalledWith({
      type: "topic",
      level: "force",
    });
  });

  it("switches to friction topic when node 'level-2' clicked", () => {
    lastNodeClickHandler("level-2");

    expect(switchToScreen).toHaveBeenCalledTimes(1);
    expect(switchToScreen).toHaveBeenCalledWith({
      type: "topic",
      level: "friction",
    });
  });

  it("switches to distance topic when node 'level-3' clicked", () => {
    lastNodeClickHandler("level-3");

    expect(switchToScreen).toHaveBeenCalledTimes(1);
    expect(switchToScreen).toHaveBeenCalledWith({
      type: "topic",
      level: "distance",
    });
  });

  it("switches to minigame title screen when node 'game-1' clicked", () => {
    lastNodeClickHandler("game-1");

    expect(switchToScreen).toHaveBeenCalledTimes(1);
    expect(switchToScreen).toHaveBeenCalledWith({
      type: "minigame",
      screen: "title",
      level: 1,
    });
  });

  it("switches to rules screen when rules button clicked", () => {
    lastButtonClickHandler("rules");

    expect(switchToScreen).toHaveBeenCalledTimes(1);
    expect(switchToScreen).toHaveBeenCalledWith({
      type: "rules",
      returnTo: { type: "map", mapId: 1 },
    });
  });

  it("switches to reference screen when reference button clicked", () => {
    lastButtonClickHandler("reference");

    expect(switchToScreen).toHaveBeenCalledTimes(1);
    expect(switchToScreen).toHaveBeenCalledWith({
      type: "reference",
      returnTo: { type: "map", mapId: 1 },
    });
  });

  it("switches to menu screen when exit button clicked", () => {
    lastButtonClickHandler("exit");

    expect(switchToScreen).toHaveBeenCalledTimes(1);
    expect(switchToScreen).toHaveBeenCalledWith({ type: "menu" });
  });

  it("initializes with map 2 config when mapId is 2", () => {
    const controller2 = new MapScreenController({ switchToScreen }, 2);

    // Test map 2 specific node
    lastNodeClickHandler("level-4");

    expect(switchToScreen).toHaveBeenCalledWith({
      type: "topic",
      level: "gravity",
    });
  });

  it("does nothing when clicking a non-existent node", () => {
    switchToScreen.mockClear();
    lastNodeClickHandler("non-existent-node");

    expect(switchToScreen).not.toHaveBeenCalled();
  });

  it("does nothing when clicking a non-existent button", () => {
    switchToScreen.mockClear();
    lastButtonClickHandler("non-existent-button");

    expect(switchToScreen).not.toHaveBeenCalled();
  });
});
