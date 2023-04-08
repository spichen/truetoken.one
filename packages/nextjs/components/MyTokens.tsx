import { useState } from "react";
import Link from "next/link";
import ServiceLogsModal from "./ServiceLogsModal";
import TokenCard from "./TokenCard";
import TransferTokenModal from "./TransferTokenModal";
import { useAccount } from "wagmi";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import getTokenFromContractResponse from "~~/utils/getTokenFromContractResponse";

const MyTokens = () => {
  const [modalTransferIsOpen, setTransferIsOpen] = useState(false);
  const [modalServiceLogIsOpen, setServiceLogIsOpen] = useState(false);
  const [tokenId, setTokenId] = useState("");
  const account = useAccount();

  const { data: rawTokens, isLoading } = useScaffoldContractRead({
    contractName: "TrueToken",
    functionName: "tokenOwnedBy",
    args: [account.address],
  });

  const tokens = rawTokens ? getTokenFromContractResponse(rawTokens) : [];

  console.log("tokens", tokens);

  if (isLoading) {
    return (
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <progress className="progress w-56"></progress>
        </div>
      </div>
    );
  }

  if (tokens.length === 0) {
    return (
      <section id="my-tokens" className="relative mb-32 pt-32">
        <div
          aria-hidden="true"
          className="absolute inset-0 top-60 grid grid-cols-2 -space-x-52 opacity-50 dark:opacity-30"
        >
          <div className="h-60 bg-gradient-to-br from-primary to-purple-400 blur-[106px] dark:from-blue-700" />
          <div className="h-40 bg-gradient-to-r from-cyan-400 to-sky-300 blur-[106px] dark:to-indigo-600" />
        </div>
        <div className="relative my-auto mx-auto px-4 sm:px-12 xl:max-w-6xl xl:px-0">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white xl:text-5xl">
              No tokens found for this account
            </h2>
            <p className="mx-auto mt-6 text-gray-700 dark:text-gray-300 md:w-3/4 lg:w-3/5">
              To acquire an NFT, purchase a product from one of our supported companies.
            </p>

            <p className="mx-auto mt-6 text-gray-700 dark:text-gray-300 md:w-3/4 lg:w-3/5">
              <span>Own a company?</span>{" "}
              <Link href="/business" className="text-primary underline dark:text-primaryLight">
                Manage your tokens
              </Link>
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="features" className="relative mb-32 pt-32">
        <div
          aria-hidden="true"
          className="absolute inset-0 top-60 grid grid-cols-2 -space-x-52 opacity-50 dark:opacity-30"
        >
          <div className="h-60 bg-gradient-to-br from-primary to-purple-400 blur-[106px] dark:from-blue-700" />
          <div className="h-40 bg-gradient-to-r from-cyan-400 to-sky-300 blur-[106px] dark:to-indigo-600" />
        </div>
        <div className="relative my-auto mx-auto px-4 sm:px-12 xl:max-w-6xl xl:px-0">
          <div className="flex">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">My Tokens</h3>
          </div>
          <div className="mt-16 grid gap-8 sm:mx-auto sm:w-2/3 md:w-full md:grid-cols-2 lg:grid-cols-3">
            {!isLoading &&
              tokens.map(token => (
                <TokenCard
                  key={token.id}
                  token={token}
                  onTransferClick={tokenId => {
                    setTokenId(tokenId);
                    setTransferIsOpen(true);
                  }}
                  onServiceLogsClick={tokenId => {
                    setTokenId(tokenId);
                    setServiceLogIsOpen(true);
                  }}
                />
              ))}
          </div>
        </div>
        <TransferTokenModal
          tokenId={tokenId}
          open={modalTransferIsOpen}
          onRequestClose={() => {
            setTransferIsOpen(false);
          }}
        />
        <ServiceLogsModal
          tokenId={tokenId}
          open={modalServiceLogIsOpen}
          onRequestClose={() => {
            setServiceLogIsOpen(false);
          }}
        />
      </section>
    </>
  );
};

export default MyTokens;
