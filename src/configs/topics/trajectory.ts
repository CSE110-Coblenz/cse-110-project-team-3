import type { TopicScreenConfig } from "../../types";
import { TrajectoryTopicNavigationButtons } from "../../configs/NavigationButtons/Topic";
import { COLORS } from "../../constants";

/**
 * Configuration for the trajectory topic screen. Find implementation details in "../../screens/TopicScreen/types"
 */
export const trajectoryConfig: TopicScreenConfig = {
  title: "Projectile Trajectory",

  descriptionSegments: [
    {
      text: "For a projectile launched from the origin (0, 0) with speed v₀ and angle θ, we combine the horizontal and vertical motions.",
    },

    { text: "\n• Horizontal motion:  " },
    { text: "x(t) = v₀ cos θ · t", bold: true, color: "#FFD54F" },

    { text: "\n• Vertical motion:  " },
    { text: "y(t) = v₀ sin θ · t - ½ g t²", bold: true, color: "#FFD54F" },

    {
      text: "\n\nTo describe the trajectory y as a function of x, we eliminate time. From the horizontal equation:",
    },
    { text: " t = x / (v₀ cos θ)", bold: true, color: "#FFD54F" },

    { text: "\nSubstitute into the vertical equation:\n" },
    {
      text: "y(x) = v₀ sin θ · (x / (v₀ cos θ)) - ½ g · (x / (v₀ cos θ))²",
      bold: true,
      color: "#FFD54F",
    },

    { text: "\nwhich simplifies to: \n" },
    {
      text: " y(x) = x tan θ - (g x²) / (2 v₀² cos² θ)",
      bold: true,
      color: "#FFD54F",
    },

    {
      text: "\n\nIf the projectile is launched and lands at the same height (y = 0), the horizontal range R is found by solving y(t) = 0 for t ≠ 0:\n",
    },
    { text: "R = (v₀² sin 2θ) / g ", bold: true, color: "#FFD54F" },
  ],

  buttons: TrajectoryTopicNavigationButtons,
  style: {
    titleColor: COLORS.text,
    descriptionColor: COLORS.text,
    backgroundColor: COLORS.bg,
  },
};
