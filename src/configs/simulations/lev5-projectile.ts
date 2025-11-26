import type { SimulationScreenConfig } from "../../screens/SimulationScreen/types";

export const Lev5SimulationConfig: SimulationScreenConfig = {
  id: "lev5-projectile",
  title: "SIMULATION: Projectile Motion",
  description: `
A ball is launched from ground level with speed v₀ = 20.0 m/s at an angle of 60° above the horizontal.
Air resistance is negligible and g = 9.8 m/s².
What is the maximum height the ball reaches above the launch point?
`,

  picture: {
    src: "/projectile.png",
  },

  options: [
    { id: "A", label: "A) 11 m", isCorrect: false },
    { id: "B", label: "B) 19 m", isCorrect: false },
    { id: "C", label: "C) 15 m", isCorrect: true },
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
    backScreen: { type: "topic", level: "projectile motion" },
    nextScreen: { type: "map", mapId: 2 },
  },
};
