import React from "react";

import { AppProps } from "next/app";
import Head from "next/head";

import "@/styles/globals.scss";
import "chart.js/auto";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>{"Different Health"}</title>
        <meta
          property="og:title"
          content={"Different Health | Senior Test"}
          key="og-title"
        />
        <meta
          property="twitter:title"
          content={"Different Health | Senior Test"}
          key="twitter-title"
        />
      </Head>

      <Component {...pageProps} />
    </>
  );
};

export default App;
