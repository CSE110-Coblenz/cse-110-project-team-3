import type { MapScreenConfig } from "../../types";
import { STAGE_HEIGHT, STAGE_WIDTH } from "../../constants";
import {
  Map1ScreenNavigationButtons,
  Map2ScreenNavigationButtons,
} from "../../configs/NavigationButtons/Map";
/**
 * Map 1: Levels 1-3 and Boss Game 1
 * Layout: 3 levels in a triangular pattern converging to the boss room
 */
export const map1Config: MapScreenConfig = {
  nodes: [
    {
      id: "level-1",
      label: "1",
      unlockIndex: 0,
      target: {
        type: "topic",
        level: "force",
      },
      position: {
        x: STAGE_WIDTH / 2 - 375,
        y: STAGE_HEIGHT / 2 - 60,
      },
      isBoss: false,
    },
    {
      id: "level-2",
      label: "2",
      unlockIndex: 1,
      target: {
        type: "topic",
        level: "friction",
      },
      position: {
        x: STAGE_WIDTH / 2 - 195,
        y: STAGE_HEIGHT / 2 - 60,
      },
      isBoss: false,
    },
    {
      id: "level-3",
      label: "3",
      unlockIndex: 2,
      target: {
        type: "topic",
        level: "distance",
      },
      position: {
        x: STAGE_WIDTH / 2 - 15,
        y: STAGE_HEIGHT / 2 - 60,
      },
      isBoss: false,
    },
    {
      id: "game-1",
      label: "Game 1",
      unlockIndex: 3,
      target: {
        type: "minigame",
        screen: "title",
        level: 1,
      },
      position: {
        x: STAGE_WIDTH / 2 + 175,
        y: STAGE_HEIGHT / 2 - 60,
      },
      isBoss: true,
      style: {
        width: 200,
        height: 120,
      },
    },
  ],
  arrows: [
    {
      from: "level-1",
      to: "level-2",
    },
    {
      from: "level-2",
      to: "level-3",
    },
    {
      from: "level-3",
      to: "game-1",
    },
  ],
  buttons: Map1ScreenNavigationButtons,
  style: {
    backgroundColor: "#1a1410",
  },
};

/**
 * Map 2: Levels 4-6 and Boss Game 2
 * Layout: 3 levels in a triangular pattern converging to the boss room
 */
export const map2Config: MapScreenConfig = {
  nodes: [
    {
      id: "level-4",
      label: "4",
      unlockIndex: 4,
      target: {
        type: "topic",
        level: "gravity",
      },
      position: {
        x: STAGE_WIDTH / 2 - 375,
        y: STAGE_HEIGHT / 2 - 60,
      },
      isBoss: false,
    },
    {
      id: "level-5",
      label: "5",
      unlockIndex: 5,
      target: {
        type: "topic",
        level: "projectile motion",
      },
      position: {
        x: STAGE_WIDTH / 2 - 195,
        y: STAGE_HEIGHT / 2 - 60,
      },
      isBoss: false,
    },
    {
      id: "level-6",
      label: "6",
      unlockIndex: 6,
      target: {
        type: "topic",
        level: "trajectory",
      },
      position: {
        x: STAGE_WIDTH / 2 - 15,
        y: STAGE_HEIGHT / 2 - 60,
      },
      isBoss: false,
    },
    {
      id: "game-2",
      label: "Game 2",
      unlockIndex: 7,
      target: {
        type: "minigame",
        screen: "title",
        level: 2,
      },
      position: {
        x: STAGE_WIDTH / 2 + 175,
        y: STAGE_HEIGHT / 2 - 60,
      },
      isBoss: true,
      style: {
        width: 200,
        height: 120,
      },
    },
  ],
  arrows: [
    {
      from: "level-4",
      to: "level-5",
    },
    {
      from: "level-5",
      to: "level-6",
    },
    {
      from: "level-6",
      to: "game-2",
    },
  ],
  buttons: Map2ScreenNavigationButtons,
  style: {
    backgroundColor: "#1a1410",
  },
};

/**
 * Default map configuration (alias for map1Config)
 */
export const defaultMapConfig = map1Config;
