import { useEffect, useState } from "react";
import Image from "next/image";
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
      <div className="card w-96 bg-base-100 shadow-xl">
        <figure style={{ borderRadius: "5px", overflow: "hidden" }}>
          <Image
            src={
              metadata?.image
                ? `${metadata?.image.replace(`ipfs://`, `https://ipfs.io/ipfs/`)}"#x-ipfs-companion-no-redirect"`
                : ""
            }
            height={100}
            width={100}
            alt=""
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{metadata?.name}</h2>
          <p>{metadata?.description}</p>
          <div className="card-actions justify-end">
            <button onClick={() => onTransferClick(token.id)} className="btn btn-primary">
              Transfer
            </button>
            {logsFeatureEnabled && (
              <button onClick={() => onServiceLogsClick(token.id)} className="btn btn-primary">
                Logs
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TokenCard;
