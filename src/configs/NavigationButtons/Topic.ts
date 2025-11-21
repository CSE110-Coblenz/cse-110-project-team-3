import type { NavButton } from "../../types";

export const FrictionTopicNavigationButtons: NavButton[] = [
    {
      id: "back",
      label: "Back",
      target: { type: "map" },
      position: {
        x: 0.05,
        y: 0.85,
      },
    },

    {
      id: "simulation",
      label: "Simulation",
      target: { type: "simulation", topic: "friction"},

      position: {
        x: 0.7,
        y: 0.85,
      },
    },
  ]

export const ProjMotionTopicNavigationButtons: NavButton[] = [
    {
      id: "back",
      label: "Back",
      target: { type: "map" },
      position: {
        x: 0.05,
        y: 0.85,
      },
    },
    {
      id: "simulation",
      label: "Simulation",
      target: { type: "simulation", topic: "projectile motion"},
      position: {
        x: 0.7,
        y: 0.85,
      },
    },
  ]