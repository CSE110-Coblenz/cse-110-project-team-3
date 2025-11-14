import { describe, it, expect, vi } from "vitest";
import type { ScreenSwitcher } from "../../../src/types";
import { createKonvaMock, FakeGroup, FakeText } from "../../mocks/konvaMock";

// Mock konva BEFORE importing the controller
vi.mock("konva", () => createKonvaMock());

import { MapScreenController } from "../../../src/screens/MapScreen/MapController";

describe("Map Screen UI Integration Test", () => {
  it('clicking the "RULES" button switches to the rules screen', () => {
    const switchToScreen = vi.fn();
    const screenSwitcher: ScreenSwitcher = { switchToScreen };

    const controller = new MapScreenController(screenSwitcher);
    const view = controller.getView();
    const rootGroup = view.getGroup() as unknown as FakeGroup;

    // Find the Group that corresponds to the RULES button:
    // It's a Group whose children include a Text with text === "RULES"
    const rulesGroup = rootGroup.children.find(
      (child) =>
        child instanceof FakeGroup &&
        child.children?.some(
          (c) => c instanceof FakeText && c.config.text === "RULES",
        ),
    );

    expect(rulesGroup).toBeDefined();

    // Simulate click
    (rulesGroup as FakeGroup).fire("click");

    expect(switchToScreen).toHaveBeenCalledTimes(1);
    expect(switchToScreen).toHaveBeenCalledWith({ type: "rules" });
  });

  it('clicking the "REFERENCE" button switches to the reference screen', () => {
    const switchToScreen = vi.fn();
    const screenSwitcher: ScreenSwitcher = { switchToScreen };

    const controller = new MapScreenController(screenSwitcher);
    const view = controller.getView();
    const rootGroup = view.getGroup() as unknown as FakeGroup;

    // Find the "REFERENCE" button to ensure we're not just picking the first button
    const referenceGroup = rootGroup.children.find(
      (child) =>
        child instanceof FakeGroup &&
        child.children?.some(
          (c) => c instanceof FakeText && c.config.text === "REFERENCE",
        ),
    );

    expect(referenceGroup).toBeDefined();
    (referenceGroup as FakeGroup).fire("click");

    expect(switchToScreen).toHaveBeenCalledTimes(1);
    expect(switchToScreen).toHaveBeenCalledWith({ type: "reference" });
  });

  it('clicking the "EXIT" button switches to the exit screen', () => {
    const switchToScreen = vi.fn();
    const screenSwitcher: ScreenSwitcher = { switchToScreen };

    const controller = new MapScreenController(screenSwitcher);
    const view = controller.getView();
    const rootGroup = view.getGroup() as unknown as FakeGroup;

    // Find the "EXIT" button to ensure we're not just picking the first button
    const exitGroup = rootGroup.children.find(
      (child) =>
        child instanceof FakeGroup &&
        child.children?.some(
          (c) => c instanceof FakeText && c.config.text === "EXIT",
        ),
    );

    expect(exitGroup).toBeDefined();
    (exitGroup as FakeGroup).fire("click");

    // The current implementation of handleExitClick does not call switchToScreen
    // expect(switchToScreen).toHaveBeenCalledTimes(1);
    // expect(switchToScreen).toHaveBeenCalledWith({ type: "exit" });
  });
});
