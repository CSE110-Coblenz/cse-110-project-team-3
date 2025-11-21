import type { TopicScreenConfig } from "../../types";
import { TrajectoryTopicNavigationButtons } from "../../configs/NavigationButtons/Topic";
import { COLORS } from "../../constants";

/**
 * Configuration for the trajectory topic screen. Find implementation details in "../../screens/TopicScreen/types"
 */
export const trajectoryConfig: TopicScreenConfig = {
  title: "Projectile Trajectory",
  description: "TODO",
  buttons: TrajectoryTopicNavigationButtons,
  style: {
    titleColor: COLORS.text,
    descriptionColor: COLORS.text,
    backgroundColor: COLORS.bg,
  },
};
