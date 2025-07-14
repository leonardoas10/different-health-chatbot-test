import React from "react";

import { GetStaticProps } from "next";
import { appWithTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Chatbot from "./chatbot/index.page";

function Home() {
  return <Chatbot />;
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, ["common"])),
    },
  };
};

export default appWithTranslation(Home);
