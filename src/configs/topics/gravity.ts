import type { TopicScreenConfig } from "../../types";
import { GravityTopicNavigationButtons } from "../../configs/NavigationButtons/Topic";
import { COLORS } from "../../constants";

/**
 * Configuration for the gravity topic screen. Find implementation details in "../../screens/TopicScreen/types"
 */
export const gravityConfig: TopicScreenConfig = {
  title: "Gravity and Vertical Motion",
  description: "TODO",
  buttons: GravityTopicNavigationButtons,
  style: {
    titleColor: COLORS.text,
    descriptionColor: COLORS.text,
    backgroundColor: COLORS.bg,
  },
};
