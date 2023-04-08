import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
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
      const res = await fetch(`${token.uri.replace("ipfs://", "https://ipfs.io/ipfs/")}#x-ipfs-companion-no-redirect`);
      const json = await res.json();
      setMetadata(json);
    })();
  }, [token]);

  return (
    <>
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl shadow-gray-600/10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none">
        <div className="space-y-6">
          {metadata?.image && (
            <Image
              src={metadata?.image}
              className="mx-auto w-auto rounded-lg border border-gray-100 dark:border-gray-700"
              width={512}
              height={512}
              alt="product image"
            />
          )}
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 transition dark:text-white">{metadata?.name}</h3>
            <p className="text-gray-600 dark:text-gray-300">{metadata?.description}</p>

            <div className="mt-3 grid grid-cols-2 gap-4">
              {Object.entries(metadata?.properties ?? []).map(([key, value]) => (
                <div
                  key={key}
                  className="dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-700 px-3 py-1 mb-3"
                >
                  <div className="text-gray-600 dark:text-gray-400">{key}</div>
                  <div className="text-lg font-semibold text-gray-800 dark:text-white">{value}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-row">
              <button
                onClick={() => onServiceLogsClick(token.id)}
                className="relative flex h-9 items-center justify-center before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition-transform before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 dark:before:border-gray-700 dark:before:bg-primaryLight sm:px-4 lg:before:border lg:before:border-gray-200 lg:before:bg-gray-100 lg:dark:before:bg-gray-800"
              >
                <span className="relative text-sm font-semibold text-white dark:text-gray-300 lg:text-primary">
                  History
                </span>
              </button>
              <button
                onClick={() => onTransferClick(token.id)}
                className="ml-3 relative flex h-9 items-center justify-center before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition-transform before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 dark:before:border-gray-700 dark:before:bg-primaryLight sm:px-4 lg:before:border lg:before:border-gray-200 lg:before:bg-gray-100 lg:dark:before:bg-gray-800"
              >
                <span className="relative text-sm font-semibold text-white dark:text-gray-300 lg:text-primary">
                  Transfer
                </span>
                <ArrowUpTrayIcon className="ml-2 h-4 w-4 dark:text-gray-300 z-10" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TokenCard;
