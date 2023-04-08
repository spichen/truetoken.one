import { useEffect, useState } from "react";
import Modal from "./Modal";
import { BigNumber } from "ethers";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

type Props = {
  open: boolean;
  onRequestClose: () => void;
  tokenId: string;
};

const HistoryModal = ({ open, onRequestClose, tokenId }: Props) => {
  const [logs, setLogs] = useState<any[]>([]);

  const { data: logCids } = useScaffoldContractRead({
    contractName: "TrueToken",
    functionName: "historyOf",
    args: [tokenId ? BigNumber.from(tokenId) : BigNumber.from(0)],
  });

  useEffect(() => {
    (async () => {
      if (!logCids) return;
      const res = await Promise.all(
        logCids.map(cid => fetch(`https://ipfs.io/ipfs/${cid}#x-ipfs-companion-no-redirect`)),
      );
      const json = await Promise.all(res.filter(re => re.ok).map(re => re.json()));
      setLogs(json);
    })();
  }, [logCids]);

  return (
    <Modal title="History" open={open} onRequestClose={onRequestClose}>
      <div className="mt-5 w-80">
        {logs?.map((log: any) => {
          return (
            <div
              key={log.timestamp}
              className="dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-700 px-3 py-1 mb-3"
            >
              <div className="flex justify-between">
                <div className="text-gray-600 dark:text-gray-400">{log.title}</div>
                <div className="text-gray-600 dark:text-gray-400">
                  {new Date(Number(log.timestamp)).toLocaleString()}
                </div>
              </div>
              <div className="text-lg font-semibold text-gray-800 dark:text-white">{log.description}</div>
            </div>
          );
        }) || <div>No logs found</div>}
      </div>

      <Modal.Action
        actions={[
          {
            title: "Close",
            onClick: onRequestClose,
          },
        ]}
      />
    </Modal>
  );
};

export default HistoryModal;
