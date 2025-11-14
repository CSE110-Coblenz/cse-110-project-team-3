import type { TopicScreenConfig } from "../../screens/TopicScreen/types";
import { COLORS } from "../../constants";

/**
 * Configuration for the projectile motion topic screen. Find implementation details in "../../screens/TopicScreen/types"
 */
export const projectileMotionConfig: TopicScreenConfig = {
  title: "Projectile Motion",
  description:
    "\nIn our case we are dealing with no air resistance so to calculate velocity in the x direction we would simply use the equation vₓ = v · cos(θ) where v is our initial velocity. \nTo calculate the velocity in the y direction we would we similarly use vᵧ = v · sin(θ).\n Since the velocity in the y direction will always be 0 at the apex and plugging it into the general formula of vᵧ = vᵧ₀ + g·t we get 0 = v * sin(θ) + gt and solving for t gives us v * sin(θ) / g = t. \nWhen solving for distance we use the equation y = y₀ + v₀·sin(θ)·t + ½ g t². \nSimilarly solving in the x direction we get the equation x = v₀ * cos(0) * t. \nAlternatively to find the range in the x direction we can use the equation: R = v₀² * sin(2θ) / g.",
  buttons: [
    {
      id: "back",
      label: "Back",
      target: { type: "topic", level: "friction" },
      position: {
        x: 0.225,
        y: 0.725,
      },
      style: {
        fill: COLORS.buttonFill,
        color: COLORS.buttonStroke,
        textFill: COLORS.buttonText,
      },
    },
    {
      id: "simulation",
      label: "Simulation",
      target: { type: "topic", level: "friction" },
      position: {
        x: 0.775,
        y: 0.725,
      },
      style: {
        fill: COLORS.buttonFill,
        color: COLORS.buttonStroke,
        textFill: COLORS.buttonText,
      },
    },
  ],
  style: {
    titleColor: COLORS.text,
    descriptionColor: COLORS.text,
    backgroundColor: COLORS.bg,
  },
};
