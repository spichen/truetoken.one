import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import ManageBrand from "~~/components/ManageBrand";
import RegisterBusiness from "~~/components/RegisterBusiness";
import { PrimaryConnectButton } from "~~/components/scaffold-eth/PrimaryConnectButton";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const Brand: NextPage = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [brandId, setBrandId] = useState<string | undefined>();
  const account = useAccount();

  const { data, isLoading } = useScaffoldContractRead({
    contractName: "TrueToken",
    functionName: "businessIdOf",
    args: [account.address],
  });

  useEffect(() => {
    if (data && data.toString() !== "0") {
      setIsRegistered(true);
      setBrandId(data?.toString());
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;

  if (account.isConnected && isRegistered && brandId) return <ManageBrand brandId={brandId} />;

  return (
    <>
      <Head>
        <title>Business: TrueToken {brandId}</title>
        <meta name="description" content="NFT Platform for physical assets" />
      </Head>

      <section id="business" className="pt-16 md:pt-32">
        <div className="mx-auto px-4 sm:px-12 xl:max-w-6xl xl:px-0">
          <div className="items-center justify-center space-y-6 md:flex md:gap-6 md:space-y-0">
            <div className="md:w-1/2 lg:w-3/5">
              <Image
                className="h-full md:-ml-8"
                src="/assets/images/business-deal.svg"
                alt="tailus components"
                loading="lazy"
                width={1865}
                height={1750}
              />
            </div>
            <div className="md:w-1/2">
              <span className="text-sm font-semibold uppercase tracking-widest text-primary dark:text-secondaryLight">
                Business
              </span>
              <h2 className="my-8 text-4xl font-bold text-gray-900 dark:text-white lg:text-5xl">
                Stop counterfeits in their tracks - own it, verify it with our{" "}
                <span className="bg-gradient-to-r from-primaryLight to-secondaryLight bg-clip-text text-transparent">
                  physical NFTs.
                </span>
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                The perfect solution for businesses looking to combat counterfeit products and prove the authenticity of
                their offerings. Our platform makes it easy to create and distribute unique physical NFTs, providing a
                secure and trustworthy way for customers to verify ownership and authenticity. Join us today and take
                the first step towards ensuring the integrity of your products.
              </p>
              <div className="mt-12">
                {account.isDisconnected && <PrimaryConnectButton />}
                {account.isConnected && !isRegistered && (
                  <RegisterBusiness
                    address={account.address ?? ""}
                    onSuccess={brandId => {
                      setBrandId(brandId);
                      setIsRegistered(true);
                      notification.success(<div>Registered successfully. Your brand ID is {brandId}</div>);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Brand;
