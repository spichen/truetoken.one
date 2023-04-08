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
      <div className="mt-8 mb-6 space-y-4">
        <div>
          <label htmlFor="product-name" className="mb-2 block text-gray-600 dark:text-gray-300">
            To Wallet
            <span className="text-xl text-red-500 dark:text-red-400">*</span>
          </label>
          <AddressInput value={toAddress} onChange={setToAddress} />
        </div>
      </div>
      <Modal.Action
        actions={[
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
