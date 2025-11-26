import type { SimulationScreenConfig } from "../../screens/SimulationScreen/types";

export const Lev2SimulationConfig: SimulationScreenConfig = {
  id: "lev2-friction",
  title: "SIMULATION: Friction Force",
  description: `
A 5.0 kg crate rests on a rough horizontal surface with a coefficient of static friction μs = 0.4 and kinetic friction μk = 0.3. 
You apply a horizontal force to the crate.
What is the minimum force required to start moving the crate (g=9.8m/s²)?
`,

  picture: {
    src: "/friction.png",
  },

  options: [
    { id: "A", label: "A) 18.0 N", isCorrect: false },
    { id: "B", label: "B) 19.6 N", isCorrect: true },
    { id: "C", label: "C) 20.0 N", isCorrect: false },
  ],

  layout: {
    rightPanelWidth: 300,
    topOffset: 200,
    bottomOffset: 90,
    leftOffset: 24,
  },

  style: {
    backgroundColor: "black",
    titleColor: "white",
    descriptionColor: "white",
  },

  navigation: {
    backScreen: { type: "topic", level: "friction" },
    nextScreen: { type: "map", mapId: 1 },
  },
};
