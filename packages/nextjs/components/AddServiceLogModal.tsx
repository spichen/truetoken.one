import { useState } from "react";
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

const AddServiceLogModal = ({ open, onRequestClose, tokenId }: Props) => {
  const [log, setLog] = useState<string>("");
  const [cid, setCid] = useState<string>("");

  const { writeAsync } = useScaffoldContractWrite({
    contractName: "TrueToken",
    functionName: "addLog",
    args: [tokenId ? BigNumber.from(tokenId) : BigNumber.from(0), cid],
  });

  const uploadToIPFS = async () => {
    const client = new NFTStorage({ token: config.nftStorageApiKey });
    const blob = new Blob([
      JSON.stringify({
        timestamp: Date.now().toString(),
        details: log,
      }),
    ]);
    const cid = await client.storeBlob(blob);
    console.log(cid);
    setCid(cid);
  };

  return (
    <Modal title="Add Service Logs" open={open} onRequestClose={onRequestClose}>
      <div>
        <InputBase value={log} onChange={setLog} />
      </div>
      <Modal.Action
        actions={[
          {
            title: "Add",
            onClick: async () => {
              await uploadToIPFS();
              await writeAsync();
              onRequestClose();
            },
          },
          {
            title: "Close",
            onClick: onRequestClose,
          },
        ]}
      />
    </Modal>
  );
};

export default AddServiceLogModal;
