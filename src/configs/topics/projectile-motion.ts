import type { ScreenConfig } from "../../types";
import { COLORS } from "../../constants";

/**
 * Configuration for the projectile motion topic screen. Find implementation details in "../../screens/TopicScreen/types"
 */
export const projectileMotionConfig: ScreenConfig = {
  title: "Projectile Motion",
  description: "TODO",
  buttons: [
    {
      id: "back",
      label: "Back",
      target: { type: "map" },
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
      target: { type: "simulation", topic: "projectile motion" },
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
