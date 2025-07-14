import React from 'react';

import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import styles from './404.module.scss';

const NotFound = () => {
  return <section className={styles.notFound}>NOT FOUND</section>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, ["common"])),
    },
  };
};

export default NotFound;
