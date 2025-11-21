import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ScreenSwitcher } from "../../../src/types";
import {
  createKonvaMock,
  FakeGroup,
  FakeText,
  FakeNode,
} from "../../mocks/konvaMock";
import { TopicScreenController } from "../../../src/screens/TopicScreen/TopicScreenController";
import type { TopicScreenConfig } from "../../../src/screens/TopicScreen/types";

vi.mock("konva", () => createKonvaMock());

// Helper: DFS to find a Group that contains a FakeText child with given label
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

describe("TopicScreenController Integration Test", () => {
  const switchToScreen = vi.fn();
  let screenSwitcher: ScreenSwitcher;
  let controller: TopicScreenController;
  let config: TopicScreenConfig;

  beforeEach(() => {
    switchToScreen.mockClear();
    screenSwitcher = { switchToScreen };
    config = {
      title: "Test Topic",
      description: "This is a test description for the topic screen.",
      buttons: [
        { id: "button1", label: "Go to Screen 1", target: { type: "screen1" } },
        { id: "button2", label: "Go to Screen 2", target: { type: "screen2" } },
      ],
    };
    controller = new TopicScreenController(screenSwitcher, config);
  });

  it("should display the correct title and description", () => {
    const view = controller.getView();
    const rootGroup = view.getGroup() as unknown as FakeGroup;

    const titleText = rootGroup.children.find(
      (child) =>
        child instanceof FakeText && child.config.text === config.title,
    ) as FakeText;
    expect(titleText).toBeDefined();
    expect(titleText.text()).toBe(config.title);

    const descriptionText = rootGroup.children.find(
      (child) =>
        child instanceof FakeText && child.config.text === config.description,
    ) as FakeText;
    expect(descriptionText).toBeDefined();
    expect(descriptionText.text()).toBe(config.description);
  });

  it("should display all configured buttons", () => {
    const view = controller.getView();
    const rootGroup = view.getGroup() as unknown as FakeGroup;

    config.buttons.forEach((buttonConfig) => {
      const buttonGroup = findGroupWithText(rootGroup, buttonConfig.label);
      expect(buttonGroup).toBeDefined();
    });
  });

  it("should switch to the correct screen when a button is clicked", () => {
    const view = controller.getView();
    const rootGroup = view.getGroup() as unknown as FakeGroup;

    const button1Group = findGroupWithText(rootGroup, config.buttons[0].label);
    expect(button1Group).toBeDefined();

    (button1Group as FakeGroup).fire("click");

    expect(switchToScreen).toHaveBeenCalledTimes(1);
    expect(switchToScreen).toHaveBeenCalledWith(config.buttons[0].target);
  });

  it("should not switch screen if an unknown button is clicked (simulated by firing on a non-existent button)", () => {
    const view = controller.getView();
    const rootGroup = view.getGroup() as unknown as FakeGroup;

    // Simulate clicking on a non-existent button by creating a dummy group and firing an event
    const dummyGroup = new FakeGroup();
    dummyGroup.fire("click", { target: { id: "nonExistentButton" } });

    expect(switchToScreen).not.toHaveBeenCalled();
  });
});
