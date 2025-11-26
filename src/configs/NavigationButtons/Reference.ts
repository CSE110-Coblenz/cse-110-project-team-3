import type { NavButton } from "../../types";

/** 
 * Navigation buttons for the reference screen (exit back to caller)
 */
export const ReferenceScreenNavigationButtons: NavButton[] = [
  {
    id: "exit",
    label: "EXIT",
    target: { type: "map" }, // overwritten dynamically in controller via setReturnTo()
    position: {
      x: 0.75,
      y: 0.85,
    },
    style: {
      width: 160,
      height: 64,
    },
  },
];
