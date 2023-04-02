import { useState } from "react";
import Head from "next/head";
import type { NextPage } from "next";
import { AddressInput } from "~~/components/scaffold-eth";
import { useScaffoldContractWrite, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";

const useRegisterBrand = () => {
  const [brandAddress, setBrandAddress] = useState<string>("");
  const [brandId, setBrandId] = useState<number | null>(null);

  const { writeAsync } = useScaffoldContractWrite({
    contractName: "TrueToken",
    functionName: "registerBrand",
    args: [brandAddress],
  });

  useScaffoldEventSubscriber({
    contractName: "TrueToken",
    eventName: "BrandRegistered",
    listener: (...[address, brandId]) => {
      if (address === brandAddress) {
        setBrandId(brandId.toNumber());
      }
    },
  });

  return {
    register: async (brandAddress: string) => {
      setBrandAddress(brandAddress);
      await writeAsync();
      await new Promise(resolve =>
        setInterval(() => {
          if (brandId !== null) {
            resolve(true);
          }
        }, 1000),
      );
      return brandId;
    },
  };
};

const Home: NextPage = () => {
  const [brandAddress, setBrandAddress] = useState<string>("");
  const { register } = useRegisterBrand();

  return (
    <>
      <Head>
        <title>TrueToken</title>
        <meta name="description" content="NFT Platform for physical assets" />
      </Head>

      <div className="flex items-center flex-col flex-grow pt-10">
        <AddressInput value={brandAddress} onChange={setBrandAddress} />
        <button
          className="btn"
          onClick={async () => {
            const brandId = await register(brandAddress);
            console.log("brandId", brandId);
          }}
        >
          {" "}
          Register{" "}
        </button>
      </div>
    </>
  );
};

export default Home;
