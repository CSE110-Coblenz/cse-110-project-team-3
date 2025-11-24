import type { TopicScreenConfig } from "../../types";
import { ProjMotionTopicNavigationButtons } from "../../configs/NavigationButtons/Topic";
import { COLORS } from "../../constants";

export const projectileMotionConfig: TopicScreenConfig = {
  title: "Projectile Motion",
  // Use descriptionSegments to bold specific phrases. Each segment may include '\n' to force new lines.
  descriptionSegments: [
    {
      text: "In our case we are dealing with no air resistance so to calculate velocity in the x direction we would simply use the equation ",
    },
    { text: "vₓ = v · cos(θ).", bold: true, color: "#FFD54F" },
    {
      text: "\nTo calculate the velocity in the y direction we would similarly use ",
    },
    { text: "vᵧ = v · sin(θ).", bold: true, color: "#FFD54F" },
    {
      text: "\nSince the velocity in the y direction will always be 0 at the apex and plugging it into the general formula of ",
    },
    { text: "vᵧ = vᵧ₀ + g·t", bold: true, color: "#FFD54F" },
    { text: " we get " },
    { text: "0 = v * sin(θ) + gt", bold: true, color: "#FFD54F" },
    { text: "\nSolving for t gives us " },
    { text: "v * sin(θ) / g = t.", bold: true, color: "#FFD54F" },
    { text: "\nWhen solving for distance we use the equation " },
    { text: "y = y₀ + v₀·sin(θ)·t + ½ g t².", bold: true, color: "#FFD54F" },
    { text: "\nSimilarly solving in the x direction we get the equation " },
    { text: "x = v₀ * cos(0) * t.", bold: true, color: "#FFD54F" },
    {
      text: "\nAlternatively to find the range in the x direction we can use the equation: ",
    },
    { text: "R = v₀² * sin(2θ) / g.", bold: true, color: "#FFD54F" },
  ],
  buttons: ProjMotionTopicNavigationButtons,
  style: {
    titleColor: COLORS.text,
    descriptionColor: COLORS.text,
    backgroundColor: COLORS.bg,
  },
};
