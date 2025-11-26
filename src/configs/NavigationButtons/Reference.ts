import type { NavButton } from "../../types";

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
