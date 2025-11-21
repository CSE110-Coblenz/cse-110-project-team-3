import type { NavButton } from "../../types";

export const Map1ScreenNavigationButtons: NavButton[] = [
    {
      id: "reference",
      label: "REFERENCE",
      target: { type: "reference", returnTo: { type: "map", mapId: 1 } },
      position: {
        x: 0.7,
        y: 0.05,
      },
      style: {
        width: 220,
        height: 64,
      },
    },
    {
      id: "rules",
      label: "RULES",
      target: { type: "rules", returnTo: { type: "map", mapId: 1 } },
      position: {
        x: 0.05,
        y: 0.85,
      },
      style: {
        width: 160,
        height: 64,
      },
    },
<<<<<<< HEAD
  },
  {
    id: "rules",
    label: "RULES",
    target: { type: "rules", returnTo: { type: "map" } },
    position: {
      x: 0.05,  // (32 + 160/2) / STAGE_WIDTH ≈ 0.14
      y: 0.85, // (STAGE_HEIGHT - 92) / STAGE_HEIGHT ≈ 0.847, adjusted for centering
=======
    {
      id: "next-map",
      label: "→",
      target: { type: "map", mapId: 2 },
      position: {
        x: 0.485,
        y: 0.85,
      },
      style: {
        width: 60,
        height: 64,
      },
>>>>>>> 2e44d99 (Added second map screen)
    },
    {
      id: "exit",
      label: "EXIT",
      target: { type: "menu" },
      position: {
        x: 0.75,
        y: 0.85,
      },
      style: {
        width: 160,
        height: 64,
      },
    },
<<<<<<< HEAD
  },
  {
    id: "exit",
    label: "EXIT",
    target: { type: "menu" },
    position: {
      x: 0.75,  // (STAGE_WIDTH - 192 + 160/2) / STAGE_WIDTH ≈ 0.86
      y: 0.85, // (STAGE_HEIGHT - 96) / STAGE_HEIGHT ≈ 0.84, adjusted for centering
=======
  ];

export const Map2ScreenNavigationButtons: NavButton[] = [
    {
      id: "reference",
      label: "REFERENCE",
      target: { type: "reference", returnTo: { type: "map", mapId: 2 } },
      position: {
        x: 0.7,
        y: 0.05,
      },
      style: {
        width: 220,
        height: 64,
      },
>>>>>>> 2e44d99 (Added second map screen)
    },
    {
      id: "rules",
      label: "RULES",
      target: { type: "rules", returnTo: { type: "map", mapId: 2 } },
      position: {
        x: 0.05,
        y: 0.85,
      },
      style: {
        width: 160,
        height: 64,
      },
    },
    {
      id: "prev-map",
      label: "←",
      target: { type: "map", mapId: 1 },
      position: {
        x: 0.485,
        y: 0.85,
      },
      style: {
        width: 60,
        height: 64,
      },
    },
    {
      id: "exit",
      label: "EXIT",
      target: { type: "menu" },
      position: {
        x: 0.75,
        y: 0.85,
      },
      style: {
        width: 160,
        height: 64,
      },
    },
  ]