import type { SimulationScreenConfig } from "../../screens/SimulationScreen/types";

export const frictionLev1SimulationConfig: SimulationScreenConfig = {
  id: "lev1-friction",
  title: "SIMULATION: Friction",
  description: "Define here the level 1 friction problem statement.",

  video: {
    src: "/Force.mp4", 
    loop: true,
    muted: true,
  },

  options: [
    { id: "A", label: "A) Option 1", isCorrect: false },
    { id: "B", label: "B) Option 2", isCorrect: true },
    { id: "C", label: "C) Option 3", isCorrect: false },
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
    backScreen: { type: "topic", level: "friction" },
    nextScreen: { type: "map"}
  },
};
