export interface GadgetData {
  title: string;
  description?: string;
}

export interface GadgetInformativeData extends GadgetData {
  number?: string | React.ReactElement;
  percentageNumber?: string | React.ReactElement;
  texts?: string[] | React.ReactElement[];
  button?: React.ReactElement;
  buttonText?: string;
  onButtonClick?(): void;
}

export interface GadgetProps {
  type?: GadgetTypes;
  size?: GadgetSizes;
  background?: GadgetBackgrounds;
  data?: GadgetInformativeData;
  isDark?: boolean;
  className?: string;
  children?: React.ReactElement | React.ReactElement[];
  info?: string;
  gripSize?: number;
}

export enum GadgetTypes {
  title = "title",
  informative = "informative",
}

export enum GadgetSizes {
  flex = "flex",
  flexTable = "flexTable",
  full = "full",
  half = "half",
  third = "third",
}

export enum GadgetBackgrounds {
  marbleYellow = "marbleYellow",
  darkCoral = "darkCoral",
}
