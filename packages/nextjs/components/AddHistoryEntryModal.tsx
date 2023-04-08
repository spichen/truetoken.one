import { useEffect, useState } from "react";
import Modal from "./Modal";
import { InputBase } from "./scaffold-eth";
import { BigNumber } from "ethers";
import { NFTStorage } from "nft.storage";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import config from "~~/truetoken.config";

type Props = {
  open: boolean;
  onRequestClose: () => void;
  tokenId: string;
};

const AddHistoryEntryModal = ({ open, onRequestClose, tokenId }: Props) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [cid, setCid] = useState<string>("");

  const { writeAsync } = useScaffoldContractWrite({
    contractName: "TrueToken",
    functionName: "addHistoryEntry",
    args: [tokenId ? BigNumber.from(tokenId) : BigNumber.from(0), cid],
  });

  const uploadToIPFS = async () => {
    const client = new NFTStorage({ token: config.nftStorageApiKey });
    const blob = new Blob([
      JSON.stringify({
        timestamp: Date.now().toString(),
        title,
        description,
      }),
    ]);
    const cid = await client.storeBlob(blob);
    console.log("I GOT THE CID -> ", cid);
    setCid(cid);
  };

  useEffect(() => {
    if (cid) {
      writeAsync();
      onRequestClose();
    }
  }, [cid]);

  return (
    <Modal title="Add History Entry" open={open} onRequestClose={onRequestClose}>
      <div className="grid grid-cols-2 gap-4 mt-5 w-80">
        <div>
          <label htmlFor="description" className="mb-2 block text-gray-600 dark:text-gray-300">
            Title
            <span className="text-xl text-red-500 dark:text-red-400">*</span>
          </label>
          <InputBase value={title} onChange={setTitle} />
        </div>
        <div>
          <label htmlFor="description" className="mb-2 block text-gray-600 dark:text-gray-300">
            Description
            <span className="text-xl text-red-500 dark:text-red-400">*</span>
          </label>
          <InputBase value={description} onChange={setDescription} />
        </div>
      </div>
      <Modal.Action
        actions={[
          {
            title: "Add",
            onClick: async () => {
              await uploadToIPFS();
            },
          },
        ]}
      />
    </Modal>
  );
};

export default AddHistoryEntryModal;
