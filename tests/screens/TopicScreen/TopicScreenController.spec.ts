import { describe, it, expect, beforeEach, vi } from "vitest";
import type { ScreenSwitcher } from "../../../src/types";
import { TopicScreenController } from "../../../src/screens/TopicScreen/TopicScreenController";
import type { TopicScreenConfig } from "../../../src/types";

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

    getGroup() {
      return {};
    }

    show() {}
    hide() {}
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
    description: "Test Description",
    buttons: [
      { id: "button1", label: "Button 1", target: { type: "map" } },
      { id: "button2", label: "Button 2", target: { type: "menu" } },
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
    expect(switchToScreen).toHaveBeenCalledWith({ type: "map" });
  });

  it("switches to another screen when another button is clicked", () => {
    lastClickHandler("button2");

    expect(switchToScreen).toHaveBeenCalledTimes(1);
    expect(switchToScreen).toHaveBeenCalledWith({ type: "menu" });
  });

  it("does nothing if a button that doesn't exist is clicked", () => {
    lastClickHandler("non-existent-button");

    expect(switchToScreen).not.toHaveBeenCalled();
  });
});
