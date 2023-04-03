import Head from "next/head";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>TrueToken</title>
        <meta name="description" content="NFT Platform for physical assets" />
      </Head>

      <div className="flex items-center flex-col flex-grow pt-10">Welcome to TrueToken</div>
    </>
  );
};

export default Home;
