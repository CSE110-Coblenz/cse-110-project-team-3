import type { TopicScreenConfig } from "../../types";
import { ForceTopicNavigationButtons } from "../../configs/NavigationButtons/Topic";
import { COLORS } from "../../constants";

/**
 * Configuration for the force topic screen. Find implementation details in "../../screens/TopicScreen/types"
 */
export const forceConfig: TopicScreenConfig = {
  title: "Force",

  // segmented description, consistent with the format used in frictionConfig
  descriptionSegments: [
    {
      text: "When you push an object, you change its motion. The stronger the push, the faster its velocity changes. The heavier the object, the harder it is to change its motion.",
    },

    { text: "\n\nNewton's Second Law summarizes this:" },
    { text: " F = m a ", bold: true, color: "#FFD54F" },

    {
      text: "\n\nOn a perfectly smooth horizontal surface, the only horizontal force is the push.",
    },

    {
      text: "\nThe acceleration a points in the same direction as the net force. A constant net force produces a constant acceleration, meaning the velocity changes by the same amount every second.",
    },

    { text: "\n\nInterpretation:" },
    {
      text: "\n• If you keep the same force and double the mass, the acceleration   becomes half as large.",
    },
    {
      text: "\n• With the same mass and double the force, the acceleration doubles.",
    },
  ],

  buttons: ForceTopicNavigationButtons,
  style: {
    titleColor: COLORS.text,
    descriptionColor: COLORS.text,
    backgroundColor: COLORS.bg,
  },
};
