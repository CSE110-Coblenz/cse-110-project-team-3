import type { SimulationScreenConfig } from "../../screens/SimulationScreen/types";

export const Lev3SimulationConfig: SimulationScreenConfig = {
  id: "lev3-distance",
  title: "SIMULATION: Stopping Distance",
  description: `
A 2.0 kg block is sliding to the right on a horizontal surface with coefficient of kinetic friction μk = 0.30.
The block has initial speed v₀ = 3.0 m/s. Gravity is g = 9.8 m/s².
How far does the block slide before it comes to rest?
`,

  video: {
    src: "/distance.mp4",
    loop: true,
    muted: true,
  },

  options: [
    { id: "A", label: "A) 1.2 m", isCorrect: false },
    { id: "B", label: "B) 1.8 m", isCorrect: false },
    { id: "C", label: "C) 1.5 m", isCorrect: true },
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
    backScreen: { type: "topic", level: "distance" },
    nextScreen: { type: "map", mapId: 1 },
  },
};
