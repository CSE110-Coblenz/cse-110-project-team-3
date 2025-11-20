import type { SimulationScreenConfig } from "../../screens/SimulationScreen/types";

export const Lev4SimulationConfig: SimulationScreenConfig = {
  id: "lev4-gravity",
  title: "SIMULATION: Gravity and Vertical Motion",
description: `
A ball is dropped from a height of 10.0 m above the ground. Air resistance is negligible and
g = 9.8 m/s².
How long does it take for the ball to reach the ground?
`,

  video: {
    src: "/Force.mp4",
    loop: true,
    muted: true,
  },

  options: [
    { id: "A", label: "A) 1.4 s", isCorrect: true },
    { id: "B", label: "B) 2.0 s", isCorrect: false },
    { id: "C", label: "C) 1.0 s", isCorrect: false },
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
    backScreen: { type: "topic", level: "gravity" },
    nextScreen: { type: "map" },
  },
};
