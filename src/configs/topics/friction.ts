import type { TopicScreenConfig } from "../../types";
import { FrictionTopicNavigationButtons } from "../../configs/NavigationButtons/Topic";
import { COLORS } from "../../constants";

/**
 * Configuration for the friction topic screen. Find implementation details in "../../screens/TopicScreen/types"
 */

export const frictionConfig: TopicScreenConfig = {
  title: "Friction",
  descriptionSegments: [
    { text: "In a vacuum the formula for a force applied to an object is" },
    { text: " F = ma. ", bold: true, color: "#FFD54F" },
    {
      text: "\n\nWhen an object is pushed in an environment with friction the force applied against that object is called kinetic friction:",
    },
    { text: " fₖ = μₖN. ", bold: true, color: "#FFD54F" },
    { text: "\n\nThe normal force applied to an object is " },
    { text: "N = mg. ", bold: true, color: "#FFD54F" },
    {
      text: "\n\nIn order to overcome the static friction on an object to start moving the force applied has to be greater than the inequality of static friction: ",
    },
    { text: "fₛ ≤ μₛN. ", bold: true, color: "#FFD54F" },
  ],

  buttons: FrictionTopicNavigationButtons,
  style: {
    titleColor: COLORS.text,
    descriptionColor: COLORS.text,
    backgroundColor: COLORS.bg,
  },
};
