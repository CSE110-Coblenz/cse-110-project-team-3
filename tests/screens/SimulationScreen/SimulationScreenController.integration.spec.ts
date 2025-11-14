import { describe, it, expect, vi } from "vitest";
import type { ScreenSwitcher } from "../../../src/types";
import {
  createKonvaMock,
  FakeGroup,
  FakeNode,
  FakeText,
} from "../../mocks/konvaMock";

// 1. Mock Konva BEFORE importing controller/view
vi.mock("konva", () => createKonvaMock());

// 2. Now import the controller
import { SimulationScreenController } from "../../../src/screens/SimulationScreen/SimulationScreenController";

// Helper: find a Group that contains a FakeText child with given label
function findGroupWithText(
  root: FakeGroup,
  label: string
): FakeGroup | undefined {
  const stack: FakeNode[] = [root];

  while (stack.length) {
    const node = stack.pop();
    if (!(node instanceof FakeGroup)) continue;

    const hasText = node.children.some(
      (c) => c instanceof FakeText && c.config.text === label
    );
    if (hasText) return node;

    node.children.forEach((child) => {
      if (child instanceof FakeGroup) stack.push(child);
    });
  }

  return undefined;
}

describe("SimulationScreenController + SimulationScreenView integration", () => {
  it('clicking "BACK" on lev1 friction goes back to topic "friction"', () => {
    const switchToScreen = vi.fn();
    const screenSwitcher: ScreenSwitcher = { switchToScreen };

    const controller = new SimulationScreenController(screenSwitcher, {
      level: "lev1",
      topic: "friction",
    });

    const view = controller.getView();
    const rootGroup = view.getGroup() as unknown as FakeGroup;

    const backGroup = findGroupWithText(rootGroup, "BACK");
    expect(backGroup).toBeDefined();

    (backGroup as FakeGroup).fire("click");

    expect(switchToScreen).toHaveBeenCalledTimes(1);
    expect(switchToScreen).toHaveBeenCalledWith({
      type: "topic",
      level: "friction",
    });
  });

  it('clicking "BACK" on lev2 projectile motion goes back to topic "projectile motion"', () => {
    const switchToScreen = vi.fn();
    const screenSwitcher: ScreenSwitcher = { switchToScreen };

    const controller = new SimulationScreenController(screenSwitcher, {
      level: "lev2",
      topic: "projectile motion",
    });

    const view = controller.getView();
    const rootGroup = view.getGroup() as unknown as FakeGroup;

    const backGroup = findGroupWithText(rootGroup, "BACK");
    expect(backGroup).toBeDefined();

    (backGroup as FakeGroup).fire("click");

    expect(switchToScreen).toHaveBeenCalledTimes(1);
    expect(switchToScreen).toHaveBeenCalledWith({
      type: "topic",
      level: "projectile motion",
    });
  });

  it("exposes a root Konva group", () => {
    const switchToScreen = vi.fn();
    const screenSwitcher: ScreenSwitcher = { switchToScreen };

    const controller = new SimulationScreenController(screenSwitcher, {
      level: "lev1",
      topic: "friction",
    });

    const view = controller.getView();
    const rootGroup = view.getGroup() as unknown as FakeGroup;

    expect(rootGroup).toBeInstanceOf(FakeGroup);
    expect(rootGroup.children.length).toBeGreaterThan(0);
  });
});
