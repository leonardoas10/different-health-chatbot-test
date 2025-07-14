import React from "react";

import { GadgetInformativeData } from "./Gadget.interface";

interface GadgetContextType {
  data?: GadgetInformativeData;
  info?: string;
  isDark?: boolean;
  children?: React.ReactElement[] | React.ReactElement | null;
}

const GadgetContext = React.createContext<GadgetContextType>({
  data: undefined,
  info: undefined,
  isDark: false,
  children: null,
});

export default GadgetContext;
