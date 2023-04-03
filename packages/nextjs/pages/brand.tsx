import { useEffect, useState } from "react";
import Head from "next/head";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import ManageBrand from "~~/components/ManageBrand";
import RegisterBrand from "~~/components/RegisterBrand";
import { useAutoConnect, useNetworkColor, useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { getTargetNetwork, notification } from "~~/utils/scaffold-eth";

const Brand: NextPage = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [brandId, setBrandId] = useState<number | undefined>();
  useAutoConnect();
  const networkColor = useNetworkColor();
  const configuredNetwork = getTargetNetwork();
  const { address } = useAccount();

  const { data } = useScaffoldContractRead({
    contractName: "TrueToken",
    functionName: "brandIdOfAddress",
    args: [address],
  });

  useEffect(() => {
    if (data && data.toNumber() > 0) {
      console.log(data.toNumber());
      setIsRegistered(true);
      setBrandId(data?.toNumber());
    }
  }, [data]);
  return (
    <>
      <Head>
        <title>Brand: TrueToken {brandId}</title>
        <meta name="description" content="NFT Platform for physical assets" />
      </Head>

      <div>
        <ConnectButton.Custom>
          {({ account, chain, openConnectModal, openChainModal, mounted }) => {
            const connected = mounted && account && chain;

            return (
              <>
                {(() => {
                  if (!connected) {
                    return (
                      <button className="btn btn-primary btn-sm" onClick={openConnectModal} type="button">
                        Connect Wallet
                      </button>
                    );
                  }

                  if (chain.unsupported || chain.id !== configuredNetwork.id) {
                    return (
                      <>
                        <span className="text-xs" style={{ color: networkColor }}>
                          {configuredNetwork.name}
                        </span>
                        <button className="btn btn-sm btn-error ml-2" onClick={openChainModal} type="button">
                          <span>Wrong network</span>
                          <ChevronDownIcon className="h-6 w-4 ml-2 sm:ml-0" />
                        </button>
                      </>
                    );
                  }

                  return isRegistered && brandId ? (
                    <ManageBrand brandId={brandId} />
                  ) : (
                    <div className="flex min-h-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                      <div className="w-full max-w-md space-y-8">
                        <RegisterBrand
                          address={account.address}
                          onSuccess={brandId => {
                            setBrandId(brandId);
                            setIsRegistered(true);
                            notification.success(<div>Registered successfully. Your brand ID is {brandId}</div>);
                          }}
                        />
                      </div>
                    </div>
                  );
                })()}
              </>
            );
          }}
        </ConnectButton.Custom>
      </div>
    </>
  );
};

export default Brand;
