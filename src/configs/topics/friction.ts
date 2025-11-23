import type { TopicScreenConfig } from "../../types";
import { FrictionTopicNavigationButtons } from "../../configs/NavigationButtons/Topic";
import { COLORS } from "../../constants";

/**
 * Configuration for the friction topic screen. Find implementation details in "../../screens/TopicScreen/types"
 */
export const frictionConfig: TopicScreenConfig = {
  title: "Friction",
  description:
    "the resistance that one surface or object encounters when moving over another.",
  buttons: FrictionTopicNavigationButtons,
  style: {
    titleColor: COLORS.text,
    descriptionColor: COLORS.text,
    backgroundColor: COLORS.bg,
  },
};
