import { useEffect, useState } from "react";
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

const ManageBrand = ({ brandId }: Props) => {
  const [minted, setMinted] = useState(false);
  const [tokens, setTokens] = useState<TrueToken[]>([]);

  useScaffoldEventSubscriber({
    contractName: "TrueToken",
    eventName: "TokenMint",
    listener: (...[walletAddress, tokenId]) => {
      console.log("arwalletAddresss", walletAddress);
      console.log("tokenId", tokenId);
      setMinted(true);
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

  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Brand {brandId}</h1>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="flex justify-center mt-10">
            <div
              className="mt-2 w-100 p-10 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              aria-orientation="vertical"
              aria-labelledby="mint-token"
              tabIndex={-1}
            >
              {contract?.address && <MintToken />}
            </div>
          </div>

          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Wallet
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Token ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Metadata
                  </th>
                </tr>
              </thead>
              <tbody>
                {tokens.map((tok: TrueToken) => {
                  return (
                    <tr key={tok.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {tok.owner}
                      </th>
                      <td className="px-6 py-4">{tok.id}</td>
                      <td className="px-6 py-4">
                        <a href={tok.uri} className="btn">
                          Metadata
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
};

export default ManageBrand;
