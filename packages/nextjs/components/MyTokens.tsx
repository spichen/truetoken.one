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
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">No Tokens!</h1>
            <p className="py-6">Purchase products from supported brands to get TrueToken NFTs.</p>
            <span className="mr-2">Own a company?</span>
            <Link href="/brand" className="btn btn-ghost btn-xs">
              Manage your tokens
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="mt-10 grid grid-cols-4 gap-10">
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
    </div>
  );
};

export default MyTokens;
