import Head from "next/head";
import type { NextPage } from "next";
import MyTokens from "~~/components/MyTokens";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>TrueToken</title>
        <meta name="description" content="NFT Platform for physical assets" />
      </Head>
      <MyTokens />
    </>
  );
};

export default Home;
