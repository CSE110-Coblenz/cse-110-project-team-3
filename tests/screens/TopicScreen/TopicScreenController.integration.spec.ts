import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ScreenSwitcher, TopicScreenConfig } from "../../../src/types";
import {
  createKonvaMock,
  FakeGroup,
  FakeText,
  FakeNode,
} from "../../mocks/konvaMock";
import { TopicScreenController } from "../../../src/screens/TopicScreen/TopicScreenController";
import {
  forceConfig,
  frictionConfig,
  distanceConfig,
  gravityConfig,
  projectileMotionConfig,
  trajectoryConfig,
} from "../../../src/configs/topics";

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

  beforeEach(() => {
    switchToScreen.mockClear();
    screenSwitcher = { switchToScreen };
  });

  // Generic test suite for any topic configuration
  function testTopicScreen(topicName: string, config: TopicScreenConfig) {
    describe(`${topicName} Topic Screen`, () => {
      let controller: TopicScreenController;

      beforeEach(() => {
        switchToScreen.mockClear();
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

        const allTextContent = rootGroup.children
          .filter((c) => c instanceof FakeText)
          .map((c) => (c as FakeText).text())
          .join(" ");
      });

      it("should display all configured buttons", () => {
        const view = controller.getView();
        const rootGroup = view.getGroup() as unknown as FakeGroup;

        config.buttons.forEach((buttonConfig) => {
          const buttonGroup = findGroupWithText(rootGroup, buttonConfig.label);
          expect(buttonGroup).toBeDefined();
        });
      });

      it("should switch to correct screen when Back button is clicked", () => {
        const view = controller.getView();
        const rootGroup = view.getGroup() as unknown as FakeGroup;

        const backButton = config.buttons.find((b) => b.id === "back");
        expect(backButton).toBeDefined();

        const backButtonGroup = findGroupWithText(rootGroup, backButton!.label);
        expect(backButtonGroup).toBeDefined();

        (backButtonGroup as FakeGroup).fire("click");

        expect(switchToScreen).toHaveBeenCalledTimes(1);
        expect(switchToScreen).toHaveBeenCalledWith(backButton!.target);
      });

      it("should switch to simulation screen when Simulation button is clicked", () => {
        const view = controller.getView();
        const rootGroup = view.getGroup() as unknown as FakeGroup;

        const simulationButton = config.buttons.find(
          (b) => b.id === "simulation",
        );
        expect(simulationButton).toBeDefined();

        const simulationButtonGroup = findGroupWithText(
          rootGroup,
          simulationButton!.label,
        );
        expect(simulationButtonGroup).toBeDefined();

        (simulationButtonGroup as FakeGroup).fire("click");

        expect(switchToScreen).toHaveBeenCalledTimes(1);
        expect(switchToScreen).toHaveBeenCalledWith(simulationButton!.target);
      });

      it("should not switch screen if an unknown button is clicked", () => {
        const dummyGroup = new FakeGroup();
        dummyGroup.fire("click", { target: { id: "nonExistentButton" } });

        expect(switchToScreen).not.toHaveBeenCalled();
      });
    });
  }

  // Test all topic screens
  testTopicScreen("Force", forceConfig);
  testTopicScreen("Friction", frictionConfig);
  testTopicScreen("Distance", distanceConfig);
  testTopicScreen("Gravity", gravityConfig);
  testTopicScreen("Projectile Motion", projectileMotionConfig);
  testTopicScreen("Trajectory", trajectoryConfig);
});
