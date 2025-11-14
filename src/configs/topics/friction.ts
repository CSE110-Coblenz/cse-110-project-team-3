import type { TopicScreenConfig } from "../../screens/TopicScreen/types";
import { COLORS } from "../../constants";

/**
 * Configuration for the friction topic screen. Find implementation details in "../../screens/TopicScreen/types"
 */

export const frictionConfig: TopicScreenConfig = {
  title: "Friction",
  description:
    "When dealing with forces it is important to understand the environment we are in. \nIn a vacuum the formula for a force applied to an object is F = ma. \nWhen an object is pushed in an environment with friction the force applied against that object is called kinetic friction:  fₖ = μₖN \nThe normal force applied to an object is N = mg. \nIn order to overcome the static friction on an object to start moving the force applied has to be greater than the inequality of static friction: fₛ ≤ μₛN.",
  buttons: [
    {
      id: "back",
      label: "Back",
      target: { type: "topic", level: "projectile motion" },
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
      target: { type: "topic", level: "projectile motion" },
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
