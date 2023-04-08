import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { useNetworkColor } from "~~/hooks/scaffold-eth";
import { getTargetNetwork } from "~~/utils/scaffold-eth";

export const PrimaryConnectButton = () => {
  const networkColor = useNetworkColor();
  const configuredNetwork = getTargetNetwork();

  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openConnectModal, openChainModal, mounted }) => {
        const connected = mounted && account && chain;

        return (
          <>
            {(() => {
              if (!connected) {
                return (
                  <button
                    type="button"
                    title="Connect Wallet"
                    onClick={openConnectModal}
                    className="relative ml-auto h-12 w-16 before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition before:duration-300 active:duration-75 active:before:scale-95 dark:before:bg-primaryLight sm:w-auto sm:px-6"
                  >
                    <span className="relative hidden w-max font-semibold text-white dark:text-gray-900 md:block">
                      {" "}
                      Connect Wallet{" "}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="relative mx-auto h-6 w-6 text-white dark:text-gray-900 md:hidden"
                    >
                      <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                    </svg>
                  </button>
                );
              }

              if (chain.unsupported || chain.id !== configuredNetwork.id) {
                return (
                  <>
                    <span className="text-xs" style={{ color: networkColor }}>
                      {configuredNetwork.name}
                    </span>
                    <button className="btn btn-sm btn-error ml-2" onClick={openChainModal} type="button">
                      <span>Wrong network</span>
                      <ChevronDownIcon className="h-6 w-4 ml-2 sm:ml-0" />
                    </button>
                  </>
                );
              }

              return (
                <div className="px-2 flex justify-end items-center">
                  <div className="flex justify-center items-center border-1 rounded-lg">
                    <div className="flex flex-col items-center mr-3">
                      <span
                        className="transition hover:text-primary dark:hover:text-primaryLight"
                        style={{ color: networkColor }}
                      >
                        {chain.name}
                      </span>
                    </div>
                    <button
                      onClick={openAccountModal}
                      type="button"
                      className="relative ml-auto flex h-9 w-full items-center justify-center before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition-transform before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 dark:before:border-gray-700 dark:before:bg-primaryLight sm:pr-4 pl-1 lg:before:border lg:before:border-gray-200 lg:before:bg-gray-100 lg:dark:before:bg-gray-800"
                    >
                      <BlockieAvatar address={account.address} size={25} ensImage={account.ensAvatar} />
                      <span className="relative text-sm font-semibold text-white dark:text-gray-900 lg:text-primary lg:dark:text-white px-2">
                        {account.displayName}
                      </span>
                      <span className="z-10 text-white">
                        <ChevronDownIcon className="h-6 w-4" />
                      </span>
                    </button>
                  </div>
                </div>
              );
            })()}
          </>
        );
      }}
    </ConnectButton.Custom>
  );
};
