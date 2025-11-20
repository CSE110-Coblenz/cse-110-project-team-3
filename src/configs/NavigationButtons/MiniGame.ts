import type { NavButton } from "../../types";

/**
 * Navigation buttons for MiniGame Title Screen
 */
export function getTitleScreenNavigationButtons(level: number): NavButton[] {
  return [
    {
      id: "back",
      label: "BACK",
      target: { type: "map" },
      position: {
        x: 0.04,    // 32px from left (32/800)
        y: 0.84,    // 504px from top ((600-96)/600)
      },
      style: {
        width: 160,
        height: 64,
      },
    },
    {
      id: "next",
      label: "NEXT",
      target: { type: "minigame", screen: "rules", level },
      position: {
        x: 0.76,    // 608px from left ((800-192)/800)
        y: 0.84,    // 504px from top
      },
      style: {
        width: 160,
        height: 64,
      },
    },
  ];
}

/**
 * Navigation buttons for MiniGame Rule Screen
 */
export function getMiniGameRuleScreenNavigationButtons(level: number): NavButton[] {
  return [
    {
      id: "back",
      label: "BACK",
      target: { type: "minigame", screen: "title", level },
      position: {
        x: 0.04,    // 32px from left
        y: 0.84,    // 504px from top
      },
      style: {
        width: 160,
        height: 64,
      },
    },
    {
      id: "next",
      label: "NEXT",
      target: { type: "minigame", screen: "simulation", level },
      position: {
        x: 0.76,    // 608px from left
        y: 0.84,    // 504px from top
      },
      style: {
        width: 160,
        height: 64,
      },
    },
  ];
}

/**
 * Navigation button for MiniGame Simulation Screen (Reference button)
 */
export function getMinigameSimulScreenNavigationButtons(level: number): NavButton[] {
  return [
    {
      id: "reference",
      label: "REFERENCE",
      target: { type: "reference", returnTo: { type: "minigame", screen: "simulation", level } },
      position: {
        x: 0.025,   // 20px from left (20/800)
        y: 0.867,   // 520px from top ((600-80)/600)
      },
      style: {
        width: 200,
        height: 55,
      },
    },
  ];
}

/**
 * Navigation button for Completed Screen
 */
export function getCompletedScreenNavigationButtons(): NavButton[] {
  return [
    {
      id: "exit",
      label: "EXIT",
      target: { type: "map" },
      position: {
        x: 0.38,    // Center: (800/2 - 96)/800
        y: 0.833,   // 500px from top ((600-100)/600)
      },
      style: {
        width: 192,
        height: 60,
      },
    },
  ];
}

/**
 * Navigation buttons for Game Over Screen
 */
export function getGameOverScreenNavigationButtons(level: number): NavButton[] {
  return [
    {
      id: "back",
      label: "BACK",
      target: { type: "minigame", screen: "title", level },
      position: {
        x: 0.38,    // Center: (800/2 - 96)/800
        y: 0.7,     // 420px from top ((600-180)/600)
      },
      style: {
        width: 192,
        height: 60,
      },
    },
    {
      id: "exit",
      label: "EXIT",
      target: { type: "map" },
      position: {
        x: 0.38,    // Center: (800/2 - 96)/800
        y: 0.833,   // 500px from top ((600-100)/600)
      },
      style: {
        width: 192,
        height: 60,
      },
    },
  ];
}