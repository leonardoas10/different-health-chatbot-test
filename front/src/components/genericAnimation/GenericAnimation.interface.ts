export interface GenericAnimationProps {
  children: React.ReactElement | React.ReactElement[];
  type?: GenericAnimationTypes;
  className?: string;
  isAnimationDisabled?: boolean;
  style?: React.CSSProperties;
  delay?: number;
}

export enum GenericAnimationTypes {
  DEFAULT = "default",
  HORIZONTAL = "horizontal",
  ORDER = "order",
  INVERSE_ORDER = "inverse-order",
  VERTICAL = "vertical",
  ZOOM = "zoom",
  NEON = "neon",
  OPACITY = "opacity",
}
