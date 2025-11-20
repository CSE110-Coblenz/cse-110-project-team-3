import type { SimulationScreenConfig } from "../../screens/SimulationScreen/types";

export const Lev6SimulationConfig: SimulationScreenConfig = {
  id: "lev6-trajectory",
  title: "SIMULATION: Projectile Trajectory",
  description: `A ball is launched from ground level at the origin O with an initial angle of 45°. Air resistance is negligible.
An obstacle's top is at point A = (20 m, 10 m).
What is the minimum launch speed required so that the ball's trajectory passes at or above point A?`,

  video: {
    src: "/Force.mp4",
    loop: true,
    muted: true,
  },

  options: [
    { id: "A", label: "A) 18.8 m/s", isCorrect: false },
    { id: "B", label: "B) 19.8 m/s", isCorrect: true },
    { id: "C", label: "C) 19.5 m/s", isCorrect: false },
  ],

  layout: {
    rightPanelWidth: 300,
    topOffset: 200,
    bottomOffset: 120,
    leftOffset: 24,
  },

  style: {
    backgroundColor: "black",
    titleColor: "white",
    descriptionColor: "white",
  },

  navigation: {
    backScreen: { type: "topic", level: "trajectory" },
    nextScreen: { type: "map" },
  },
};
