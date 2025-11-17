import type { SimulationScreenConfig } from "../../screens/SimulationScreen/types";

export const frictionLev1SimulationConfig: SimulationScreenConfig = {
  id: "lev1-friction",
  title: "SIMULATION: Friction",
  description: 
  `A 5 kg crate rests on a roungh horizontal surface with a coefficient of static friction μs = 0.4 and kinetic friction μk = 0.3. 
You apply a horizontal force to the crate 
What is the minimum force required to start moving the crate?`,

  video: {
    src: "/Force.mp4", 
    loop: true,
    muted: true,
  },

  options: [
    { id: "A", label: "A) 19.6 N", isCorrect: true },
    { id: "B", label: "B) 18 N", isCorrect: false },
    { id: "C", label: "C) 20 N", isCorrect: false },
  ],

  layout: {
    rightPanelWidth: 300,
    topOffset: 180,
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
