import React from 'react';

import { useTranslation } from 'next-i18next';

import GenericAnimation from '../genericAnimation/GenericAnimation.component';
import { InformativeGadget } from './components/informativeGadget/InformativeGadget.component';
import GadgetContext from './Gadget.context';
import {
  GadgetBackgrounds,
  GadgetProps,
  GadgetTypes
} from './Gadget.interface';
import styles from './Gadget.module.scss';

export const Gadget = ({
  type = GadgetTypes.informative,
  size,
  background,
  data,
  isDark,
  className,
  children,
  info,
  gripSize = 1,
}: GadgetProps) => {
  const { t } = useTranslation("common");
  const isDarkEnabled = isDark || background === GadgetBackgrounds.darkCoral;

  const handleType = (): React.ReactElement => {
    switch (type) {
      case GadgetTypes.informative:
      default:
        return <InformativeGadget />;
    }
  };

  const handleSize = (): string => {
    const sizeClass = `box___${size}`;

    return size ? styles[sizeClass] : "";
  };

  return (
    <GenericAnimation
      className={`${styles.box} ${handleSize()} ${className ? className : ""}`}
      style={{ gridColumn: `auto / span ${gripSize}` }}
    >
      <GadgetContext.Provider
        value={{ data, isDark: isDarkEnabled, children, info }}
      >
        {handleType()}
      </GadgetContext.Provider>
    </GenericAnimation>
  );
};
