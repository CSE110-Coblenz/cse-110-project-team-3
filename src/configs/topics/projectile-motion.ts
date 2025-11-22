import type { TopicScreenConfig } from "../../types";
import { ProjMotionTopicNavigationButtons } from "../../configs/NavigationButtons/Topic";
import { COLORS } from "../../constants";

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
