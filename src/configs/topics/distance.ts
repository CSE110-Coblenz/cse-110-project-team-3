import type { TopicScreenConfig } from "../../types";
import { DistanceTopicNavigationButtons } from "../../configs/NavigationButtons/Topic";
import { COLORS } from "../../constants";

/**
 * Configuration for the distance topic screen. Find implementation details in "../../screens/TopicScreen/types"
 */
export const distanceConfig: TopicScreenConfig = {
  title: "Stopping Distance",
  description: "TODO",
  buttons: DistanceTopicNavigationButtons,
  style: {
    titleColor: COLORS.text,
    descriptionColor: COLORS.text,
    backgroundColor: COLORS.bg,
  },
};
