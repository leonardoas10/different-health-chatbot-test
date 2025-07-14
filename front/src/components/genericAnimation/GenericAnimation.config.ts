import { Variants } from "framer-motion";

import { GenericAnimationTypes } from "./GenericAnimation.interface";

const DEFAULT_ANIMATION: Variants = {
  initial: {
    opacity: 0,
  },
  animate: (custom) => ({
    opacity: 1,
    transition: {
      duration: 1,
      delay: custom || 0,
    },
  }),
};

const HORIZONTAL_ANIMATION: Variants = {
  initial: {
    x: -100,
    opacity: 0,
  },
  animate: (custom) => ({
    x: 0,
    opacity: 1,
    transition: {
      duration: 2.5,
      type: "spring",
      bounce: 0.5,
      delay: custom || 0,
    },
  }),
};

const ORDER_ANIMATION: Variants = {
  initial: {
    y: -50,
    opacity: 0,
  },
  animate: (custom) => ({
    y: 0,
    opacity: 1,
    transition: {
      duration: 1.5,
      staggerChildren: 0.2,
      type: "spring",
      bounce: 0.5,
      delay: custom || 0,
    },
  }),
};

const INVERSE_ORDER_ANIMATION: Variants = {
  initial: {
    y: 40,
    opacity: 0,
  },
  animate: (custom) => ({
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      delay: custom || 0,
    },
  }),
};

const VERTICAL_ANIMATION: Variants = {
  initial: {
    y: -20,
    opacity: 0,
  },
  animate: (custom) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: custom || 0,
    },
  }),
};

const ZOOM_ANIMATION: Variants = {
  initial: {
    scale: 0.8,
    opacity: 0,
  },
  animate: (custom) => ({
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
      delay: custom || 0,
    },
  }),
};

const NEON_ANIMATION: Variants = {
  initial: {
    scale: 0.8,
    opacity: 0,
  },
  animate: (custom) => ({
    scale: 1,
    opacity: [1, 0, 1, 0.47, 1, 0.32, 0.51, 1, 0.39, 1, 0.62, 1, 0.55, 0.9, 1],
    transition: {
      duration: 3.5,
      times: [
        0, 0.34, 0.4, 0.46, 0.52, 0.57, 0.63, 0.69, 0.75, 0.81, 0.86, 0.92,
        0.98, 1,
      ],
      ease: "easeInOut",
      delay: custom || 0,
    },
  }),
};

const OPACITY: Variants = {
  initial: {
    opacity: 0,
  },
  animate: (custom) => ({
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "linear",
      delay: custom || 0,
    },
  }),
};

export const ANIMATION_DICTIONARY: Record<GenericAnimationTypes, Variants> = {
  [GenericAnimationTypes.DEFAULT]: DEFAULT_ANIMATION,
  [GenericAnimationTypes.HORIZONTAL]: HORIZONTAL_ANIMATION,
  [GenericAnimationTypes.ORDER]: ORDER_ANIMATION,
  [GenericAnimationTypes.INVERSE_ORDER]: INVERSE_ORDER_ANIMATION,
  [GenericAnimationTypes.VERTICAL]: VERTICAL_ANIMATION,
  [GenericAnimationTypes.ZOOM]: ZOOM_ANIMATION,
  [GenericAnimationTypes.NEON]: NEON_ANIMATION,
  [GenericAnimationTypes.OPACITY]: OPACITY,
};
