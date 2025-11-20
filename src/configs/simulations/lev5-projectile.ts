import type { SimulationScreenConfig } from "../../screens/SimulationScreen/types";

export const Lev5SimulationConfig: SimulationScreenConfig = {
  id: "lev5-projectile",
  title: "SIMULATION: Projectile Motion",
description: `
A ball is launched from ground level with speed v₀ = 20.0 m/s at an angle of 60° above the horizontal.
Air resistance is negligible and g = 9.8 m/s².
What is the maximum height the ball reaches above the launch point?`,

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
    backScreen: { type: "topic", level: "projectile motion" },
    nextScreen: { type: "map" },
  },
};
