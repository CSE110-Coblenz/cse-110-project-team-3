import { describe, it, expect, beforeEach, vi } from "vitest";
import type { ScreenSwitcher } from "../../../src/types";
import { SimulationScreenController } from "../../../src/screens/SimulationScreen/SimulationScreenController";
import type { SimulationScreenConfig } from "../../../src/screens/SimulationScreen/types";
import type { NavButton } from "../../../src/types";

let lastConfig: SimulationScreenConfig;
let lastNavigationButtons: NavButton[];
let lastButtonClickHandler: (buttonId: string) => void;

vi.mock("../../../src/screens/SimulationScreen/SimulationScreenView", () => {
  class FakeSimulationScreenView {
    constructor(
      config: SimulationScreenConfig,
      navigationButtons: NavButton[],
      buttonClickHandler: (buttonId: string) => void,
    ) {
      lastConfig = config;
      lastNavigationButtons = navigationButtons;
      lastButtonClickHandler = buttonClickHandler;
    }

    getGroup() {
      return {};
    }

    show() {}
    hide() {}
  }

  return {
    SimulationScreenView: FakeSimulationScreenView,
  };
});

describe("SimulationScreenController", () => {
  const switchToScreen = vi.fn();
  let controller: SimulationScreenController;

  const config: SimulationScreenConfig = {
    id: "lev1-friction",
    title: "Friction Simulation",
    description: "Test the effects of friction",
    options: [
      { id: "A", label: "Option A", isCorrect: true },
      { id: "B", label: "Option B", isCorrect: false },
      { id: "C", label: "Option C", isCorrect: false },
    ],
    navigation: {
      backScreen: { type: "topic", level: "friction" },
      nextScreen: { type: "map" },
    },
  };

  beforeEach(() => {
    switchToScreen.mockClear();

    const screenSwitcher: ScreenSwitcher = {
      switchToScreen,
    };

    controller = new SimulationScreenController(screenSwitcher, config);
  });

  it("initializes with correct config", () => {
    expect(lastConfig).toEqual(config);
    expect(lastNavigationButtons).toBeDefined();
    expect(lastNavigationButtons.length).toBeGreaterThan(0);
  });

  it("switches to topic screen when back button is clicked", () => {
    lastButtonClickHandler("back");

    expect(switchToScreen).toHaveBeenCalledTimes(1);
    expect(switchToScreen).toHaveBeenCalledWith({
      type: "topic",
      level: "friction",
    });
  });

  it("switches to map screen when next button is clicked", () => {
    lastButtonClickHandler("next");

    expect(switchToScreen).toHaveBeenCalledTimes(1);
    expect(switchToScreen).toHaveBeenCalledWith({ type: "map" });
  });

  it("handles different navigation screens", () => {
    const customConfig: SimulationScreenConfig = {
      id: "lev2-gravity",
      title: "Gravity Simulation",
      description: "Test the effects of gravity",
      options: [
        { id: "A", label: "Option A", isCorrect: false },
        { id: "B", label: "Option B", isCorrect: true },
        { id: "C", label: "Option C", isCorrect: false },
      ],
      navigation: {
        backScreen: { type: "topic", level: "gravity" },
        nextScreen: { type: "minigame", screen: "title", level: 2 },
      },
    };

    new SimulationScreenController({ switchToScreen }, customConfig);

    lastButtonClickHandler("next");

    expect(switchToScreen).toHaveBeenCalledWith({
      type: "minigame",
      screen: "title",
      level: 2,
    });
  });

  it("does nothing when clicking a non-existent button", () => {
    switchToScreen.mockClear();
    lastButtonClickHandler("non-existent-button");

    expect(switchToScreen).not.toHaveBeenCalled();
  });
});
