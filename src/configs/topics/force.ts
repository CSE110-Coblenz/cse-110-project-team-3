import type { TopicScreenConfig } from "../../types";
import { ForceTopicNavigationButtons } from "../../configs/NavigationButtons/Topic";
import { COLORS } from "../../constants";

/**
 * Configuration for the force topic screen. Find implementation details in "../../screens/TopicScreen/types"
 */
export const forceConfig: TopicScreenConfig = {
  title: "Force, Mass and Acceleration",
  description: "TODO",
  buttons: ForceTopicNavigationButtons,
  style: {
    titleColor: COLORS.text,
    descriptionColor: COLORS.text,
    backgroundColor: COLORS.bg,
  },
};
