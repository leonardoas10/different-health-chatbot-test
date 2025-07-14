import React, { useContext, useState } from 'react';

import { useTranslation } from 'next-i18next';

import GadgetContext from '../../Gadget.context';
import styles from './InformativeGadget.module.scss';

export const InformativeGadget = () => {
  const [isInformationVisible, setInformationVisible] =
    useState<boolean>(false);
  const { data, info, isDark, children } = useContext(GadgetContext);
  const { t } = useTranslation("common");

  const toggleInformation = (): void => {
    setInformationVisible(!isInformationVisible);
  };

  return (
    <>
      {data?.title && (
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <h3
              className={`${styles.header__title} ${isDark ? styles.header__title___isBoxDark : ""}`}
            >
              {data.title}
            </h3>
          </div>
        </div>
      )}

      {data?.description && (
        <p className={styles.description}>{data.description}</p>
      )}

      <div className={styles.contentWrapper}>
        <>
          <p
            className={`${styles.contentWrapper__information} ${!isInformationVisible ? styles.contentWrapper__information___hidden : ""}`}
          >
            {info}
          </p>

          <div
            className={`${styles.content} ${children && data?.title ? styles.content___children : ""} ${isInformationVisible ? styles.content___hidden : ""}`}
          >
            {(data?.percentageNumber || data?.number) && (
              <div
                className={`${styles.number} ${isDark ? styles.number___isBoxDark : ""}`}
              >
                {data?.percentageNumber && (
                  <>
                    {data?.percentageNumber}
                    <span className={styles.number__percentage}>%</span>
                  </>
                )}

                {data?.number && data.number}
              </div>
            )}

            {data?.texts?.map((text, index: number) => (
              <div key={index} className={styles.content__info}>
                {text}
              </div>
            ))}

            {children}
          </div>
        </>
      </div>
    </>
  );
};
