import type { TopicScreenConfig } from "../../types";
import { ProjMotionTopicNavigationButtons } from "../../configs/NavigationButtons/Topic";
import { COLORS } from "../../constants";
import { ProjMotionTopicNavigationButtons } from "../NavigationButtons/Topic";

/**
 * Configuration for the projectile motion topic screen. Find implementation details in "../../screens/TopicScreen/types"
 */
export const projectileMotionConfig: TopicScreenConfig = {
  title: "Projectile Motion",
  description: "TODO",
  buttons: ProjMotionTopicNavigationButtons,
  style: {
    titleColor: COLORS.text,
    descriptionColor: COLORS.text,
    backgroundColor: COLORS.bg,
  },
};
