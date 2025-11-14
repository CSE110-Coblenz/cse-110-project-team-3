import { describe, it, expect, vi } from "vitest";
import type { ScreenSwitcher } from "../../../src/types";
import {
  createKonvaMock,
  FakeGroup,
  FakeNode,
  FakeText,
} from "../../mocks/konvaMock";

vi.mock("konva", () => createKonvaMock());

import { RulesScreenController } from "../../../src/screens/RulesScreen/RulesScreenController";

// helper: DFS to find a Group that contains a FakeText child with given label
function findGroupWithText(
  root: FakeGroup,
  label: string,
): FakeGroup | undefined {
  const stack: FakeNode[] = [root];

  while (stack.length) {
    const node = stack.pop();
    if (!(node instanceof FakeGroup)) continue;

    const hasText = node.children.some(
      (c) => c instanceof FakeText && c.config.text === label,
    );
    if (hasText) return node;

    node.children.forEach((child) => {
      if (child instanceof FakeGroup) stack.push(child);
    });
  }

  return undefined;
}

describe("RulesScreenController + RulesScreenView integration", () => {
  it('clicking "EXIT" button switches back to map screen', () => {
    const switchToScreen = vi.fn();
    const screenSwitcher: ScreenSwitcher = { switchToScreen };

    const controller = new RulesScreenController(screenSwitcher);
    const view = controller.getView();
    const rootGroup = view.getGroup() as unknown as FakeGroup;

    // Find the EXIT button group (Group containing Text "EXIT")
    const exitGroup = findGroupWithText(rootGroup, "EXIT");
    expect(exitGroup).toBeDefined();

    // Simulate a click
    (exitGroup as FakeGroup).fire("click");

    // Controller should navigate back to map
    expect(switchToScreen).toHaveBeenCalledTimes(1);
    expect(switchToScreen).toHaveBeenCalledWith({ type: "map" });
  });
});
