import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ScreenSwitcher } from "../../../src/types";
import { createKonvaMock, FakeGroup, FakeText } from "../../mocks/konvaMock";
import { setCurrentLevelIndex } from "../../../src/types";

// Mock konva BEFORE importing the controller
vi.mock("konva", () => createKonvaMock());

import { MapScreenController } from "../../../src/screens/MapScreen/MapController";

// Helper function to find a group by button text label
function findButtonGroup(
  rootGroup: FakeGroup,
  label: string,
): FakeGroup | undefined {
  return rootGroup.children.find(
    (child) =>
      child instanceof FakeGroup &&
      child.children?.some(
        (c) => c instanceof FakeText && c.config.text === label,
      ),
  ) as FakeGroup | undefined;
}

describe("Map Screen UI Integration Test", () => {
  const switchToScreen = vi.fn();
  let screenSwitcher: ScreenSwitcher;

  beforeEach(() => {
    switchToScreen.mockClear();
    screenSwitcher = { switchToScreen };
    setCurrentLevelIndex(100); // Unlock all levels
  });

  describe("Map 1 Screen", () => {
    it('clicking the "RULES" button switches to the rules screen with map 1 return', () => {
      const controller = new MapScreenController(screenSwitcher, 1);
      const view = controller.getView();
      const rootGroup = view.getGroup() as unknown as FakeGroup;

      const rulesGroup = findButtonGroup(rootGroup, "RULES");
      expect(rulesGroup).toBeDefined();

      rulesGroup!.fire("click");

      expect(switchToScreen).toHaveBeenCalledTimes(1);
      expect(switchToScreen).toHaveBeenCalledWith({
        type: "rules",
        returnTo: { type: "map", mapId: 1 },
      });
    });

    it('clicking the "REFERENCE" button switches to the reference screen with map 1 return', () => {
      const controller = new MapScreenController(screenSwitcher, 1);
      const view = controller.getView();
      const rootGroup = view.getGroup() as unknown as FakeGroup;

      const referenceGroup = findButtonGroup(rootGroup, "REFERENCE");
      expect(referenceGroup).toBeDefined();

      referenceGroup!.fire("click");

      expect(switchToScreen).toHaveBeenCalledTimes(1);
      expect(switchToScreen).toHaveBeenCalledWith({
        type: "reference",
        returnTo: { type: "map", mapId: 1 },
      });
    });

    it('clicking the "EXIT" button switches to the menu screen', () => {
      const controller = new MapScreenController(screenSwitcher, 1);
      const view = controller.getView();
      const rootGroup = view.getGroup() as unknown as FakeGroup;

      const exitGroup = findButtonGroup(rootGroup, "EXIT");
      expect(exitGroup).toBeDefined();

      exitGroup!.fire("click");

      expect(switchToScreen).toHaveBeenCalledTimes(1);
      expect(switchToScreen).toHaveBeenCalledWith({ type: "menu" });
    });

    it('clicking the "→" button switches to map 2', () => {
      const controller = new MapScreenController(screenSwitcher, 1);
      const view = controller.getView();
      const rootGroup = view.getGroup() as unknown as FakeGroup;

      const nextMapGroup = findButtonGroup(rootGroup, "→");
      expect(nextMapGroup).toBeDefined();

      nextMapGroup!.fire("click");

      expect(switchToScreen).toHaveBeenCalledTimes(1);
      expect(switchToScreen).toHaveBeenCalledWith({ type: "map", mapId: 2 });
    });

    it('clicking level node "1" switches to force topic', () => {
      const controller = new MapScreenController(screenSwitcher, 1);
      const view = controller.getView();
      const rootGroup = view.getGroup() as unknown as FakeGroup;

      const level1Group = findButtonGroup(rootGroup, "1");
      expect(level1Group).toBeDefined();

      level1Group!.fire("click");

      expect(switchToScreen).toHaveBeenCalledTimes(1);
      expect(switchToScreen).toHaveBeenCalledWith({
        type: "topic",
        level: "force",
      });
    });

    it('clicking level node "2" switches to friction topic', () => {
      const controller = new MapScreenController(screenSwitcher, 1);
      const view = controller.getView();
      const rootGroup = view.getGroup() as unknown as FakeGroup;

      const level2Group = findButtonGroup(rootGroup, "2");
      expect(level2Group).toBeDefined();

      level2Group!.fire("click");

      expect(switchToScreen).toHaveBeenCalledTimes(1);
      expect(switchToScreen).toHaveBeenCalledWith({
        type: "topic",
        level: "friction",
      });
    });

    it('clicking level node "3" switches to distance topic', () => {
      const controller = new MapScreenController(screenSwitcher, 1);
      const view = controller.getView();
      const rootGroup = view.getGroup() as unknown as FakeGroup;

      const level3Group = findButtonGroup(rootGroup, "3");
      expect(level3Group).toBeDefined();

      level3Group!.fire("click");

      expect(switchToScreen).toHaveBeenCalledTimes(1);
      expect(switchToScreen).toHaveBeenCalledWith({
        type: "topic",
        level: "distance",
      });
    });

    it('clicking boss node "Game 1" switches to minigame 1 title screen', () => {
      const controller = new MapScreenController(screenSwitcher, 1);
      const view = controller.getView();
      const rootGroup = view.getGroup() as unknown as FakeGroup;

      const game1Group = findButtonGroup(rootGroup, "Game 1");
      expect(game1Group).toBeDefined();

      game1Group!.fire("click");

      expect(switchToScreen).toHaveBeenCalledTimes(1);
      expect(switchToScreen).toHaveBeenCalledWith({
        type: "minigame",
        screen: "title",
        level: 1,
      });
    });
  });

  describe("Map 2 Screen", () => {
    it('clicking the "RULES" button switches to the rules screen with map 2 return', () => {
      const controller = new MapScreenController(screenSwitcher, 2);
      const view = controller.getView();
      const rootGroup = view.getGroup() as unknown as FakeGroup;

      const rulesGroup = findButtonGroup(rootGroup, "RULES");
      expect(rulesGroup).toBeDefined();

      rulesGroup!.fire("click");

      expect(switchToScreen).toHaveBeenCalledTimes(1);
      expect(switchToScreen).toHaveBeenCalledWith({
        type: "rules",
        returnTo: { type: "map", mapId: 2 },
      });
    });

    it('clicking the "REFERENCE" button switches to the reference screen with map 2 return', () => {
      const controller = new MapScreenController(screenSwitcher, 2);
      const view = controller.getView();
      const rootGroup = view.getGroup() as unknown as FakeGroup;

      const referenceGroup = findButtonGroup(rootGroup, "REFERENCE");
      expect(referenceGroup).toBeDefined();

      referenceGroup!.fire("click");

      expect(switchToScreen).toHaveBeenCalledTimes(1);
      expect(switchToScreen).toHaveBeenCalledWith({
        type: "reference",
        returnTo: { type: "map", mapId: 2 },
      });
    });

    it('clicking the "EXIT" button switches to the menu screen', () => {
      const controller = new MapScreenController(screenSwitcher, 2);
      const view = controller.getView();
      const rootGroup = view.getGroup() as unknown as FakeGroup;

      const exitGroup = findButtonGroup(rootGroup, "EXIT");
      expect(exitGroup).toBeDefined();

      exitGroup!.fire("click");

      expect(switchToScreen).toHaveBeenCalledTimes(1);
      expect(switchToScreen).toHaveBeenCalledWith({ type: "menu" });
    });

    it('clicking the "←" button switches to map 1', () => {
      const controller = new MapScreenController(screenSwitcher, 2);
      const view = controller.getView();
      const rootGroup = view.getGroup() as unknown as FakeGroup;

      const prevMapGroup = findButtonGroup(rootGroup, "←");
      expect(prevMapGroup).toBeDefined();

      prevMapGroup!.fire("click");

      expect(switchToScreen).toHaveBeenCalledTimes(1);
      expect(switchToScreen).toHaveBeenCalledWith({ type: "map", mapId: 1 });
    });

    it('clicking level node "4" switches to gravity topic', () => {
      const controller = new MapScreenController(screenSwitcher, 2);
      const view = controller.getView();
      const rootGroup = view.getGroup() as unknown as FakeGroup;

      const level4Group = findButtonGroup(rootGroup, "4");
      expect(level4Group).toBeDefined();

      level4Group!.fire("click");

      expect(switchToScreen).toHaveBeenCalledTimes(1);
      expect(switchToScreen).toHaveBeenCalledWith({
        type: "topic",
        level: "gravity",
      });
    });

    it('clicking level node "5" switches to projectile motion topic', () => {
      const controller = new MapScreenController(screenSwitcher, 2);
      const view = controller.getView();
      const rootGroup = view.getGroup() as unknown as FakeGroup;

      const level5Group = findButtonGroup(rootGroup, "5");
      expect(level5Group).toBeDefined();

      level5Group!.fire("click");

      expect(switchToScreen).toHaveBeenCalledTimes(1);
      expect(switchToScreen).toHaveBeenCalledWith({
        type: "topic",
        level: "projectile motion",
      });
    });

    it('clicking level node "6" switches to trajectory topic', () => {
      const controller = new MapScreenController(screenSwitcher, 2);
      const view = controller.getView();
      const rootGroup = view.getGroup() as unknown as FakeGroup;

      const level6Group = findButtonGroup(rootGroup, "6");
      expect(level6Group).toBeDefined();

      level6Group!.fire("click");

      expect(switchToScreen).toHaveBeenCalledTimes(1);
      expect(switchToScreen).toHaveBeenCalledWith({
        type: "topic",
        level: "trajectory",
      });
    });

    it('clicking boss node "Game 2" switches to minigame 2 title screen', () => {
      const controller = new MapScreenController(screenSwitcher, 2);
      const view = controller.getView();
      const rootGroup = view.getGroup() as unknown as FakeGroup;

      const game2Group = findButtonGroup(rootGroup, "Game 2");
      expect(game2Group).toBeDefined();

      game2Group!.fire("click");

      expect(switchToScreen).toHaveBeenCalledTimes(1);
      expect(switchToScreen).toHaveBeenCalledWith({
        type: "minigame",
        screen: "title",
        level: 2,
      });
    });
  });
});
