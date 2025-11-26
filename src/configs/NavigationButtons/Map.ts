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
];
