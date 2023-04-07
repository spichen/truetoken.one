import { useEffect, useState } from "react";
import Modal from "./Modal";
import { AddressInput } from "./scaffold-eth";
import { BigNumber } from "ethers";
import { useAccount } from "wagmi";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

type Props = {
  open: boolean;
  onRequestClose: () => void;
  tokenId: string;
};

const TransferTokenModal = ({ open, onRequestClose, tokenId }: Props) => {
  const account = useAccount();
  const [toAddress, setToAddress] = useState<string>("");

  const { writeAsync, isSuccess } = useScaffoldContractWrite({
    contractName: "TrueToken",
    functionName: "safeTransferFrom",
    args: [account.address, toAddress, tokenId ? BigNumber.from(tokenId) : BigNumber.from(0), BigNumber.from(1), "0x"],
  });

  useEffect(() => {
    if (isSuccess) {
      onRequestClose();
    }
  }, [isSuccess, onRequestClose]);

  return (
    <Modal title="Transfer Token" open={open} onRequestClose={onRequestClose}>
      <div className="relative p-6 flex-auto">
        <AddressInput value={toAddress} onChange={setToAddress} />
      </div>
      <Modal.Action
        actions={[
          {
            title: "Close",
            onClick: onRequestClose,
          },
          {
            title: "Transfer",
            onClick: async () => {
              await writeAsync();
            },
          },
        ]}
      />
    </Modal>
  );
};

export default TransferTokenModal;
