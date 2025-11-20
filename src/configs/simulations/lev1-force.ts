import type { SimulationScreenConfig } from "../../screens/SimulationScreen/types";

export const Lev1SimulationConfig: SimulationScreenConfig = {
  id: "lev1-force",
  title: `SIMULATION: Force`,
  description: `
A 4.0 block is on a frictionless horizontal surface.
YOu want the block to accelerate at 1.5 m/s².
What constant horizontal force should you apply?
`,

  video: {
    src: "/Force.mp4",
    loop: true,
    muted: true,
  },

  options: [
    { id: "A", label: "A) 4.0 N", isCorrect: false },
    { id: "B", label: "B) 6.0 N", isCorrect: true },
    { id: "C", label: "C) 8.0 N", isCorrect: false },
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
    backScreen: { type: "topic", level: "force" },
    nextScreen: { type: "map" },
  },
};
