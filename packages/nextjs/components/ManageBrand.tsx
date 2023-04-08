import { useEffect, useState } from "react";
import AddServiceLogModal from "./AddServiceLogModal";
import MintToken from "./MintToken";
import ServiceLogsModal from "./ServiceLogsModal";
import { Abi } from "abitype";
import { BigNumber } from "ethers";
import { useContract, useProvider } from "wagmi";
import { useDeployedContractInfo, useScaffoldContractRead, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";
import config from "~~/truetoken.config";
import { TrueToken } from "~~/types/truetoken";
import getTokenFromContractResponse from "~~/utils/getTokenFromContractResponse";
import { notification } from "~~/utils/scaffold-eth";

type Props = {
  brandId: string;
};

const ManageBrand = ({ brandId }: Props) => {
  const [modalMintIsOpen, setMintIsOpen] = useState(false);
  const [modalServiceLogIsOpen, setServiceLogIsOpen] = useState(false);
  const [modalAddServiceLogIsOpen, setAddServiceLogIsOpen] = useState(false);
  const [minted, setMinted] = useState(false);
  const [token, setSelectedToken] = useState("");
  const [tokens, setTokens] = useState<TrueToken[]>([]);

  useScaffoldEventSubscriber({
    contractName: "TrueToken",
    eventName: "TokenMint",
    listener: (...[walletAddress, tokenId]) => {
      if (walletAddress && tokenId) setMinted(true);
    },
  });
  const provider = useProvider();
  const { data: deployedContractData } = useDeployedContractInfo("TrueToken");

  const contract = useContract({
    address: deployedContractData?.address,
    abi: deployedContractData?.abi as Abi,
    signerOrProvider: provider,
  });

  const { data: rawTokens } = useScaffoldContractRead({
    contractName: "TrueToken",
    functionName: "tokenIssuedBy",
    args: [BigNumber.from(brandId)],
  });

  useEffect(() => {
    if (rawTokens) {
      setTokens(getTokenFromContractResponse(rawTokens));
    }
  }, [rawTokens]);

  useEffect(() => {
    if (minted) {
      notification.success(<div>Token Minted</div>);
    }
  }, [minted]);

  const logsFeatureEnabled = config.featureToggle.serviceLogs;

  return (
    <>
      <header className="flex justify-between items-center bg-white shadow w-full">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Brand Name</h1>
          <h2>Brand ID: {brandId}</h2>
        </div>
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <button
            className="btn btn-primary"
            onClick={() => {
              setMintIsOpen(true);
            }}
          >
            Mint Token
          </button>
        </div>
      </header>

      <main className="w-full">
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          {contract?.address && (
            <MintToken
              open={modalMintIsOpen}
              onRequestClose={() => {
                setMintIsOpen(false);
              }}
            />
          )}

          <div className="shadow">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Wallet</th>
                  <th>Token ID</th>
                  <th>Metadata</th>
                  {logsFeatureEnabled && <th>Logs</th>}
                </tr>
              </thead>
              <tbody>
                {tokens.map((tok: TrueToken) => {
                  return (
                    <tr key={tok.id}>
                      <th>{tok.owner}</th>
                      <td>{tok.id}</td>
                      <td>
                        <a href={tok.uri} className="btn btn-ghost btn-xs">
                          Metadata
                        </a>
                      </td>
                      {logsFeatureEnabled && (
                        <td>
                          <button
                            onClick={() => {
                              setSelectedToken(tok.id);
                              setServiceLogIsOpen(true);
                            }}
                            className="btn btn-ghost btn-xs"
                          >
                            Logs
                          </button>
                          <button
                            onClick={() => {
                              setSelectedToken(tok.id);
                              setAddServiceLogIsOpen(true);
                            }}
                            className="btn btn-ghost btn-xs"
                          >
                            Add Log
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <ServiceLogsModal
          tokenId={token}
          open={modalServiceLogIsOpen}
          onRequestClose={() => {
            setServiceLogIsOpen(false);
          }}
        />
        <AddServiceLogModal
          tokenId={token}
          open={modalAddServiceLogIsOpen}
          onRequestClose={() => {
            setAddServiceLogIsOpen(false);
          }}
        />
      </main>
    </>
  );
};

export default ManageBrand;
