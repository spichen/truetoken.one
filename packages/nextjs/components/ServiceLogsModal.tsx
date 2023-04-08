import { useEffect, useState } from "react";
import Modal from "./Modal";
import { BigNumber } from "ethers";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

type Props = {
  open: boolean;
  onRequestClose: () => void;
  tokenId: string;
};

const ServiceLogsModal = ({ open, onRequestClose, tokenId }: Props) => {
  const [logs, setLogs] = useState<any[]>([]);

  const { data: logCids } = useScaffoldContractRead({
    contractName: "TrueToken",
    functionName: "logsOf",
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
    <Modal title="Service Logs" open={open} onRequestClose={onRequestClose}>
      {logs?.map((log: any) => {
        return <div key={log}>{JSON.stringify(log)}</div>;
      }) || <div>No logs found</div>}

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

export default ServiceLogsModal;
