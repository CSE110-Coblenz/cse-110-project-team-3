import { describe, it, expect, beforeEach, vi } from "vitest";
import type { ScreenSwitcher } from "../../../src/types";
import { TopicScreenController } from "../../../src/screens/TopicScreen/TopicScreenController";
import type { TopicScreenConfig } from "../../../src/screens/TopicScreen/types";

let lastCreatedView: any;
let lastConfig: any;
let lastClickHandler: any;

vi.mock("../../../src/screens/TopicScreen/TopicScreenView", () => {
  class FakeTopicScreenView {
    constructor(config: any, clickHandler: any) {
      lastConfig = config;
      lastClickHandler = clickHandler;
      lastCreatedView = this;
    }
  }

  return {
    TopicScreenView: FakeTopicScreenView,
  };
});

describe("TopicScreenController", () => {
  const switchToScreen = vi.fn();
  let controller: TopicScreenController;

  const config: TopicScreenConfig = {
    title: "Test Topic",
    buttons: [
      { id: "button1", text: "Button 1", target: { type: "test-screen1" } },
      { id: "button2", text: "Button 2", target: { type: "test-screen2" } },
    ],
  };

  beforeEach(() => {
    switchToScreen.mockClear();

    const screenSwitcher: ScreenSwitcher = {
      switchToScreen,
    };

    controller = new TopicScreenController(screenSwitcher, config);
  });

  it("is created correctly", () => {
    expect(lastConfig).toBe(config);
    expect(controller.getView()).toBe(lastCreatedView);
  });

  it("switches to the correct screen when a button is clicked", () => {
    lastClickHandler("button1");

    expect(switchToScreen).toHaveBeenCalledTimes(1);
    expect(switchToScreen).toHaveBeenCalledWith({ type: "test-screen1" });
  });

  it("switches to another screen when another button is clicked", () => {
    lastClickHandler("button2");

    expect(switchToScreen).toHaveBeenCalledTimes(1);
    expect(switchToScreen).toHaveBeenCalledWith({ type: "test-screen2" });
  });

  it("does nothing if a button that doesn't exist is clicked", () => {
    lastClickHandler("non-existent-button");

    expect(switchToScreen).not.toHaveBeenCalled();
  });
});
