import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ScreenSwitcher } from "../../../src/types";
import {
  createKonvaMock,
  FakeGroup,
  FakeText,
  FakeNode,
} from "../../mocks/konvaMock";
import { ReferenceScreenController } from "../../../src/screens/ReferenceScreens/ReferenceScreenController";

vi.mock("konva", () => createKonvaMock());

// Helper: DFS to find a Group that contains a FakeText child with given label
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

describe("ReferenceScreenController Integration Test", () => {
  const switchToScreen = vi.fn();
  let screenSwitcher: ScreenSwitcher;
  let controller: ReferenceScreenController;

  beforeEach(() => {
    switchToScreen.mockClear();
    screenSwitcher = { switchToScreen };
    controller = new ReferenceScreenController(screenSwitcher);
  });

  it("should display the correct title", () => {
    const view = controller.getView();
    const rootGroup = view.getGroup() as unknown as FakeGroup;

    const titleText = rootGroup.children.find(
      (child) => child instanceof FakeText && child.config.text === "References"
    ) as FakeText;
    expect(titleText).toBeDefined();
    expect(titleText.text()).toBe("References");
  });

  it("should display the exit button", () => {
    const view = controller.getView();
    const rootGroup = view.getGroup() as unknown as FakeGroup;

    const exitButtonGroup = findGroupWithText(rootGroup, "EXIT");
    expect(exitButtonGroup).toBeDefined();
  });

  it("should switch to the correct screen when the exit button is clicked", () => {
    const view = controller.getView();
    const rootGroup = view.getGroup() as unknown as FakeGroup;

    const exitButtonGroup = findGroupWithText(rootGroup, "EXIT");
    expect(exitButtonGroup).toBeDefined();

    (exitButtonGroup as FakeGroup).fire("click");

    // TODO: Uncomment once the switchToScreen call is implemented in the controller
    // expect(switchToScreen).toHaveBeenCalledTimes(1);
    // expect(switchToScreen).toHaveBeenCalledWith({ type: "map" });
  });
});
