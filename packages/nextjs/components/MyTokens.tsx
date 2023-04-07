import { useState } from "react";
import TokenCard from "./TokenCard";
import TransferTokenModal from "./TransferTokenModal";
import { useAccount } from "wagmi";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import getTokenFromContractResponse from "~~/utils/getTokenFromContractResponse";

const MyTokens = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [tokenId, setTokenId] = useState("");
  const account = useAccount();

  const { data } = useScaffoldContractRead({
    contractName: "TrueToken",
    functionName: "tokenOwnedBy",
    args: [account.address],
  });

  return (
    <div>
      {data &&
        getTokenFromContractResponse(data).map(token => (
          <TokenCard
            key={token.id}
            token={token}
            onTransferClick={tokenId => {
              setTokenId(tokenId);
              setIsOpen(true);
            }}
          />
        ))}
      <TransferTokenModal
        tokenId={tokenId}
        open={modalIsOpen}
        onRequestClose={() => {
          setIsOpen(false);
        }}
      />
    </div>
  );
};

export default MyTokens;
