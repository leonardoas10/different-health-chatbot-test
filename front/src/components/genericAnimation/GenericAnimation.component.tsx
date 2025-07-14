import React from "react";

import { motion } from "framer-motion";

import { ANIMATION_DICTIONARY } from "./GenericAnimation.config";
import {
  GenericAnimationProps,
  GenericAnimationTypes,
} from "./GenericAnimation.interface";

const GenericAnimation = ({
  children,
  type = GenericAnimationTypes.ORDER,
  className,
  isAnimationDisabled,
  style,
  delay = 0,
}: GenericAnimationProps) => {
  const initialProps = isAnimationDisabled ? { opacity: 1 } : "initial";
  const animateProps = isAnimationDisabled ? { opacity: 1 } : "animate";

  return (
    <motion.div
      initial={initialProps}
      whileInView={animateProps}
      viewport={{ once: true }}
      variants={ANIMATION_DICTIONARY[type] || ANIMATION_DICTIONARY["default"]}
      exit={"initial"}
      style={style}
      custom={delay}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default GenericAnimation;
