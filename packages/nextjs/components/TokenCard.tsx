import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import config from "~~/truetoken.config";
import { TrueToken } from "~~/types/truetoken";

type TokenMetadata = {
  name: string;
  description: string;
  image: string;
  properties: TokenMetadataProperties;
};

type TokenMetadataProperties = {
  model: string;
  serial_number: string;
  purchase_date: string;
  warranty_expiry_date: string;
};

const TokenCard = ({
  token,
  onTransferClick,
  onServiceLogsClick,
}: {
  token: TrueToken;
  onTransferClick: (tokenId: string) => void;
  onServiceLogsClick: (tokenId: string) => void;
}) => {
  const [metadata, setMetadata] = useState<TokenMetadata | undefined>(undefined);
  useEffect(() => {
    (async () => {
      const res = await fetch(token.uri.replace("ipfs://", "https://ipfs.io/ipfs/"));
      const json = await res.json();
      setMetadata(json);
    })();
  }, [token]);

  const logsFeatureEnabled = config.featureToggle.serviceLogs;

  return (
    <>
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl shadow-gray-600/10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none">
        <div className="space-y-12 text-center">
          <Image
            src={
              metadata?.image
                ? `${metadata?.image.replace(`ipfs://`, `https://ipfs.io/ipfs/`)}"#x-ipfs-companion-no-redirect"`
                : ""
            }
            className="mx-auto h-14 w-auto"
            width={512}
            height={512}
            alt="burger illustration"
          />
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800 transition dark:text-white">{metadata?.name}</h3>
            <p className="text-gray-600 dark:text-gray-300">{metadata?.description}</p>
            <button
              onClick={() => onTransferClick(token.id)}
              className="relative ml-auto flex h-9 items-center justify-center before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition-transform before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 dark:before:border-gray-700 dark:before:bg-primaryLight sm:px-4 lg:before:border lg:before:border-gray-200 lg:before:bg-gray-100 lg:dark:before:bg-gray-800"
            >
              <span className="relative text-sm font-semibold text-white dark:text-gray-300 lg:text-primary">
                Transfer
              </span>
              <ArrowUpTrayIcon className="ml-2 h-4 w-4 dark:text-gray-300 z-10" />
            </button>
            {logsFeatureEnabled && (
              <button
                onClick={() => onServiceLogsClick(token.id)}
                className="group relative mx-auto flex h-12 w-12 items-center justify-center before:absolute before:inset-0 before:rounded-full before:border before:border-gray-200 before:bg-gray-50 before:bg-gradient-to-b before:transition-transform before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 dark:before:border-gray-700 dark:before:bg-gray-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="-transtransition-transform relative h-5 w-5 text-gray-600 duration-300 group-hover:translate-x-1 dark:text-white"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TokenCard;
