import type { TopicScreenConfig } from "../../types";
import { DistanceTopicNavigationButtons } from "../../configs/NavigationButtons/Topic";
import { COLORS } from "../../constants";

/**
 * Configuration for the distance topic screen. Find implementation details in "../../screens/TopicScreen/types"
 */
export const distanceConfig: TopicScreenConfig = {
  title: "Stopping Distance",

  // reformatted into segmented description, same structure as frictionConfig
  descriptionSegments: [
    {
      text: "Real surfaces are not perfectly smooth. Microscopic bumps and roughness create a friction force that opposes motion.",
    },

    {
      text: "\n\nWhen an object is sliding, the relevant force is the kinetic friction force:",
    },
    { text: " F_fric = μₖ N ", bold: true, color: "#FFD54F" },
    { text: "\n• μₖ is the coefficient of kinetic friction" },
    { text: "\n• N is the normal force" },

    {
      text: "\n\nFor a block on a horizontal surface with no vertical acceleration, the normal force balances the weight",
    },
    { text: " (N = m g) ", bold: true, color: "#FFD54F" },
    { text: "so" },
    { text: " F_fric = μₖ m g", bold: true, color: "#FFD54F" },

    { text: "\n\nIn the horizontal direction, the net force becomes:\n" },
    { text: "F_net = F_push - F_fric = m a ", bold: true, color: "#FFD54F" },

    {
      text: "\nTo obtain a target acceleration a, your push must both overcome friction and still provide additional net force:",
    },
    { text: " F_push = m a + μₖ m g ", bold: true, color: "#FFD54F" },
  ],

  buttons: DistanceTopicNavigationButtons,
  style: {
    titleColor: COLORS.text,
    descriptionColor: COLORS.text,
    backgroundColor: COLORS.bg,
  },
};
