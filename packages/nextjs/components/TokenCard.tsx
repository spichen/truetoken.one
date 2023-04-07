import { useEffect, useState } from "react";
import Image from "next/image";
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

const TokenCard = ({ token, onTransferClick }: { token: TrueToken; onTransferClick: (tokenId: string) => void }) => {
  const [metadata, setMetadata] = useState<TokenMetadata | undefined>(undefined);
  useEffect(() => {
    (async () => {
      const res = await fetch(token.uri.replace("ipfs://", "https://ipfs.io/ipfs/"));
      const json = await res.json();
      setMetadata(json);
    })();
  }, [token]);
  return (
    <div className="!z-5 relative flex flex-col rounded-[20px] max-w-[300px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 flex flex-col w-full !p-4 3xl:p-![18px] bg-white undefined">
      <div className="h-full w-full">
        <div className="relative w-full">
          <Image
            src={metadata?.image.replace(`ipfs://`, `https://ipfs.io/ipfs/`) || ""}
            className="mb-3 h-full w-full rounded-xl 3xl:h-full 3xl:w-full"
            width={300}
            height={300}
            alt=""
          />
          <button className="absolute top-3 right-3 flex items-center justify-center rounded-full bg-white p-2 text-brand-500 hover:cursor-pointer">
            <div className="flex h-full w-full items-center justify-center rounded-full text-xl hover:bg-gray-50">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 512 512"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="32"
                  d="M352.92 80C288 80 256 144 256 144s-32-64-96.92-64c-52.76 0-94.54 44.14-95.08 96.81-1.1 109.33 86.73 187.08 183 252.42a16 16 0 0018 0c96.26-65.34 184.09-143.09 183-252.42-.54-52.67-42.32-96.81-95.08-96.81z"
                ></path>
              </svg>
            </div>
          </button>
        </div>
        <div className="mb-3 flex items-center justify-between px-1 md:items-start">
          <div className="mb-2">
            <p className="text-lg font-bold text-navy-700"> {metadata?.name} </p>
            <p className="mt-1 text-sm font-medium text-gray-600 md:mt-2">{metadata?.description} </p>
          </div>
        </div>
        <div className="flex items-center justify-between md:items-center lg:justify-between ">
          <button className="btn" onClick={() => onTransferClick(token.id)}>
            Transfer
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenCard;
