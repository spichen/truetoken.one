import { useState } from "react";
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

  const { data } = useScaffoldContractRead({
    contractName: "TrueToken",
    functionName: "tokenOwnedBy",
    args: [account.address],
  });

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-4 gap-10">
        {data &&
          getTokenFromContractResponse(data).map(token => (
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
