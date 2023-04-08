import { useState } from "react";
import { ethers } from "ethers";
import { useAccount, useNetwork } from "wagmi";
import { hardhat, localhost } from "wagmi/chains";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { useAccountBalance, useTransactor } from "~~/hooks/scaffold-eth";
import { getLocalProvider } from "~~/utils/scaffold-eth";

// Number of ETH faucet sends to an address
const NUM_OF_ETH = "1";

/**
 * FaucetButton button which lets you grab eth.
 */
export const FaucetButton = () => {
  const { address } = useAccount();
  const { balance } = useAccountBalance(address);
  const { chain: ConnectedChain } = useNetwork();
  const [loading, setLoading] = useState(false);
  const provider = getLocalProvider(localhost);
  const signer = provider?.getSigner();
  const faucetTxn = useTransactor(signer);

  const sendETH = async () => {
    try {
      setLoading(true);
      await faucetTxn({ to: address, value: ethers.utils.parseEther(NUM_OF_ETH) });
      setLoading(false);
    } catch (error) {
      console.error("⚡️ ~ file: FaucetButton.tsx:sendETH ~ error", error);
      setLoading(false);
    }
  };

  // Render only on local chain
  if (!ConnectedChain || ConnectedChain.id !== hardhat.id) {
    return null;
  }

  return (
    <>
      <div className="flex items-center justify-center">
        <button
          data-tooltip-target="tooltip-default"
          className={`group relative hidden h-9 w-9 rounded-full before:absolute before:inset-0 before:rounded-full before:border before:border-gray-200 before:bg-gray-50 before:bg-gradient-to-b before:transition-transform before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 dark:before:border-gray-700 dark:before:bg-gray-800 lg:flex ${
            loading ? "loading before:!w-4 before:!h-4 before:!mx-0" : ""
          }`}
          onClick={sendETH}
          disabled={loading}
        >
          {!loading && <BanknotesIcon className="h-4 w-4 z-10 text-white m-auto" />}
        </button>
        {!balance && <div className="ml-3 text-white text-xs">Grab funds from faucet</div>}
      </div>
    </>
  );
};
