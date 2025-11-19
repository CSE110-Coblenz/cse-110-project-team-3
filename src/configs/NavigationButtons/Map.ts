import type { NavButton } from "../../types";

export const MapScreenNavigationButtons: NavButton[] = [
  {
    id: "reference",
    label: "REFERENCE",
    target: { type: "reference" },
    position: {
      x: 0.7, // (STAGE_WIDTH - 260) / STAGE_WIDTH ≈ 0.675, but centering at 0.825
      y: 0.05,  // 24 / STAGE_HEIGHT = 0.04
    },
    style: {
      width: 220,
      height: 64,
    },
  },
  {
    id: "rules",
    label: "RULES",
    target: { type: "rules" },
    position: {
      x: 0.05,  // (32 + 160/2) / STAGE_WIDTH ≈ 0.14
      y: 0.85, // (STAGE_HEIGHT - 92) / STAGE_HEIGHT ≈ 0.847, adjusted for centering
    },
    style: {
      width: 160,
      height: 64,
    },
  },
  {
    id: "exit",
    label: "EXIT",
    target: { type: "level" },
    position: {
      x: 0.75,  // (STAGE_WIDTH - 192 + 160/2) / STAGE_WIDTH ≈ 0.86
      y: 0.85, // (STAGE_HEIGHT - 96) / STAGE_HEIGHT ≈ 0.84, adjusted for centering
    },
    style: {
      width: 160,
      height: 64,
    },
  },
];