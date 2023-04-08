import { useEffect, useState } from "react";
import Head from "next/head";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import ManageBrand from "~~/components/ManageBrand";
import RegisterBrand from "~~/components/RegisterBrand";
import { useAutoConnect, useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const Brand: NextPage = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [brandId, setBrandId] = useState<string | undefined>();
  useAutoConnect();
  const account = useAccount();

  const { data, isLoading } = useScaffoldContractRead({
    contractName: "TrueToken",
    functionName: "brandIdOf",
    args: [account.address],
  });

  useEffect(() => {
    if (data && data.toString() !== "0") {
      setIsRegistered(true);
      setBrandId(data?.toString());
    }
  }, [data]);

  return (
    <>
      <Head>
        <title>Brand: TrueToken {brandId}</title>
        <meta name="description" content="NFT Platform for physical assets" />
      </Head>

      <div className="flex items-center flex-col flex-grow">
        {account.isDisconnected && (
          <div className="hero min-h-screen bg-base-200">
            <div className="hero-content text-center">
              <div className="max-w-md">
                <div>
                  <h1 className="text-center mb-8">
                    <span className="block text-2xl mb-2">Welcome to</span>
                    <span className="block text-4xl font-bold">TrueToken</span>
                  </h1>
                  <p className="text-center text-lg">Connect your wallet to get started</p>
                  <div className="flex flex-col justify-center items-center">
                    <ConnectButton />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {isLoading && <div>Loading...</div>}
        {account.isConnected && isRegistered && brandId ? (
          <ManageBrand brandId={brandId} />
        ) : (
          <div className="flex min-h-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
              <RegisterBrand
                address={account.address ?? ""}
                onSuccess={brandId => {
                  setBrandId(brandId);
                  setIsRegistered(true);
                  notification.success(<div>Registered successfully. Your brand ID is {brandId}</div>);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Brand;
