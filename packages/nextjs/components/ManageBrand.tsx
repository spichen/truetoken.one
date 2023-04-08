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
      <section id="manage-business" className="pt-32">
        <div className="mx-auto px-4 sm:px-12 xl:max-w-6xl xl:px-0">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">Manage Tokens</h3>
            <button
              className="relative ml-auto h-12 w-16 before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition before:duration-300 active:duration-75 active:before:scale-95 dark:before:bg-primaryLight sm:w-auto sm:px-6"
              onClick={() => {
                setMintIsOpen(true);
              }}
            >
              <span className="relative hidden w-max font-semibold text-white dark:text-gray-900 md:block">
                {" "}
                Mint Token{" "}
              </span>
            </button>
          </div>
          <div className="mt-12">
            <div className="flex h-full flex-col justify-center space-y-6 md:space-y-8">
              <table className="h-px w-full table-fixed">
                <thead className="divide-y divide-gray-200 rounded-sm border border-b border-gray-200 dark:divide-gray-700 dark:border-gray-700 [&>*]:divide-x [&>*]:divide-gray-200 [&>*]:dark:divide-gray-700">
                  <tr>
                    <th className="bg-gray-50 py-3 pl-6 text-left text-sm font-medium text-gray-900 dark:bg-gray-800 dark:text-white">
                      Owner
                    </th>
                    <th className="bg-gray-50 py-3 pl-6 text-left text-sm font-medium text-gray-900 dark:bg-gray-800 dark:text-white">
                      Token ID
                    </th>
                    <th className="bg-gray-50 py-3 pl-6 text-left text-sm font-medium text-gray-900 dark:bg-gray-800 dark:text-white">
                      Details
                    </th>
                    {logsFeatureEnabled && <th>Logs</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 border-x border-b border-gray-200 dark:divide-gray-700 dark:border-gray-700 [&>*]:divide-x [&>*]:divide-gray-200 [&>*]:dark:divide-gray-700">
                  {tokens.map((tok: TrueToken) => {
                    return (
                      <tr key={tok.id}>
                        <th className="py-5 px-6 text-left text-sm font-normal text-gray-600 dark:text-gray-400">
                          {tok.owner}
                        </th>
                        <td className="py-5 px-6 text-left text-sm font-normal text-gray-600 dark:text-gray-400">
                          {tok.id}
                        </td>
                        <td className="py-5 px-6 text-left text-sm font-normal text-gray-600 dark:text-gray-400">
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
        </div>
        {contract?.address && (
          <MintToken
            open={modalMintIsOpen}
            onRequestClose={() => {
              setMintIsOpen(false);
            }}
          />
        )}
        {config.featureToggle.serviceLogs && (
          <>
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
          </>
        )}
      </section>
    </>
  );
};

export default ManageBrand;
