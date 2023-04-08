import { useEffect, useState } from "react";
import AddHistoryEntryModal from "./AddHistoryEntryModal";
import HistoryModal from "./HistoryModal";
import MintToken from "./MintToken";
import { Abi } from "abitype";
import { BigNumber } from "ethers";
import { useContract, useProvider } from "wagmi";
import { useDeployedContractInfo, useScaffoldContractRead, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";
import { TrueToken } from "~~/types/truetoken";
import getTokenFromContractResponse from "~~/utils/getTokenFromContractResponse";
import { notification } from "~~/utils/scaffold-eth";

type Props = {
  brandId: string;
};

const ManageBusiness = ({ brandId }: Props) => {
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

  const { data: business } = useScaffoldContractRead({
    contractName: "TrueToken",
    functionName: "business",
    args: [BigNumber.from(brandId)],
  });

  const businessName = business && (business as unknown as any[])[2];

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

  return (
    <>
      <section id="manage-business" className="pt-32">
        <div className="mx-auto px-4 sm:px-12 xl:max-w-6xl xl:px-0">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm font-semibold uppercase tracking-widest text-primary dark:text-secondaryLight">
                {businessName}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">Manage Tokens</h3>
            </div>
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
                    <th className="bg-gray-50 py-3 pl-6 text-left text-sm font-medium text-gray-900 dark:bg-gray-800 dark:text-white w-36">
                      Details
                    </th>
                    <th className="bg-gray-50 py-3 pl-6 text-left text-sm font-medium text-gray-900 dark:bg-gray-800 dark:text-white w-72">
                      History
                    </th>
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
                          <a
                            href={tok.uri}
                            className="relative ml-auto flex h-6 w-full items-center justify-center before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition-transform before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 dark:before:border-gray-700 dark:before:bg-primaryLight sm:px-4 lg:before:border lg:before:border-gray-200 lg:before:bg-gray-100 lg:dark:before:bg-gray-800"
                          >
                            <span className="relative text-xs font-semibold text-white dark:text-gray-900 lg:text-primary lg:dark:text-white">
                              Metadata
                            </span>
                          </a>
                        </td>
                        <td className="py-5 px-6 text-left text-sm font-normal text-gray-600 dark:text-gray-400">
                          <div className="grid grid-cols-2 gap-4">
                            <button
                              onClick={() => {
                                setSelectedToken(tok.id);
                                setServiceLogIsOpen(true);
                              }}
                              className="relative ml-auto flex h-6 w-full items-center justify-center before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition-transform before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 dark:before:border-gray-700 dark:before:bg-primaryLight sm:px-4 lg:before:border lg:before:border-gray-200 lg:before:bg-gray-100 lg:dark:before:bg-gray-800"
                            >
                              <span className="relative text-xs font-semibold text-white dark:text-gray-900 lg:text-primary lg:dark:text-white">
                                View History{" "}
                              </span>
                            </button>
                            <button
                              onClick={() => {
                                setSelectedToken(tok.id);
                                setAddServiceLogIsOpen(true);
                              }}
                              className="relative ml-auto flex h-6 w-full items-center justify-center before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition-transform before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 dark:before:border-gray-700 dark:before:bg-primaryLight sm:px-4 lg:before:border lg:before:border-gray-200 lg:before:bg-gray-100 lg:dark:before:bg-gray-800"
                            >
                              <span className="relative text-xs font-semibold text-white dark:text-gray-900 lg:text-primary lg:dark:text-white">
                                Add New
                              </span>
                            </button>
                          </div>
                        </td>
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
        <>
          <HistoryModal
            tokenId={token}
            open={modalServiceLogIsOpen}
            onRequestClose={() => {
              setServiceLogIsOpen(false);
            }}
          />
          <AddHistoryEntryModal
            tokenId={token}
            open={modalAddServiceLogIsOpen}
            onRequestClose={() => {
              setAddServiceLogIsOpen(false);
            }}
          />
        </>
      </section>
    </>
  );
};

export default ManageBusiness;
