import type { NavButton, Screen } from "../../types";

/**
 * Navigation buttons for Simulation screens
 * Note: The target screens are provided by the simulation config at runtime
 */
export function getSimulationNavigationButtons(
  backScreen: Screen,
  nextScreen: Screen,
): NavButton[] {
  return [
    {
      id: "back",
      label: "BACK",
      target: backScreen,
      position: {
        x: 0.025, // 20px from left (20/800)
        y: 0.883, // 530px from top ((600-50-20)/600)
      },
      style: {
        width: 150,
        height: 50,
      },
    },
    {
      id: "next",
      label: "NEXT",
      target: nextScreen,
      position: {
        x: 0.7875, // 630px from left ((800-150-20)/800)
        y: 0.883, // 530px from top
      },
      style: {
        width: 150,
        height: 50,
      },
    },
  ];
}
