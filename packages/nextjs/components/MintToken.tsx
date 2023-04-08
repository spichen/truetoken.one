import { useEffect, useState } from "react";
import Modal from "./Modal";
import { AddressInput } from "./scaffold-eth";
import { NFTStorage } from "nft.storage";
import { SubmitHandler, useForm } from "react-hook-form";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import config from "~~/truetoken.config.js";

type MintTokenForm = {
  to: string;
  name: string;
  image: string;
  description: string;
  model: string;
  serial_number: string;
  purchase_date: string;
  warranty_expiry: string;
};

type Props = {
  open: boolean;
  onRequestClose: () => void;
};

const MintToken = ({ open, onRequestClose }: Props) => {
  const [customerWallet, setCustomerWallet] = useState<string>("");
  const { register, handleSubmit, reset } = useForm<MintTokenForm>();
  const [metadataURI, setMetadataURI] = useState<string | undefined>(undefined);
  const [contractCalled, setContractCalled] = useState<boolean>(false);

  const { writeAsync, isSuccess, isLoading } = useScaffoldContractWrite({
    contractName: "TrueToken",
    functionName: "mint",
    args: [customerWallet, metadataURI],
  });

  const client = new NFTStorage({ token: config.nftStorageApiKey });

  const onSubmit: SubmitHandler<MintTokenForm> = async data => {
    const metadataBlob = new Blob([
      JSON.stringify({
        name: data.name,
        description: data.description,
        image: data.image,
        properties: {
          model: data.model,
          serial_number: data.serial_number,
          purchase_date: data.purchase_date,
          warranty_expiry: data.warranty_expiry,
        },
      }),
    ]);

    const { car } = await NFTStorage.encodeBlob(metadataBlob);

    const cid = await client.storeCar(car);

    setMetadataURI(cid);
  };

  useEffect(() => {
    if (metadataURI && !contractCalled) {
      writeAsync();
      setContractCalled(true);
      setCustomerWallet("");
      reset();
    }
  }, [metadataURI, contractCalled, writeAsync, setContractCalled, setCustomerWallet, reset]);

  useEffect(() => {
    if (isSuccess) {
      onRequestClose();
    }
  }, [isSuccess, onRequestClose]);

  return (
    <Modal title="Mint Token" open={open} onRequestClose={onRequestClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-8 mb-6 space-y-4">
          <div>
            <label htmlFor="product-name" className="mb-2 block text-gray-600 dark:text-gray-300">
              Customer Wallet
              <span className="text-xl text-red-500 dark:text-red-400">*</span>
            </label>
            <AddressInput value={customerWallet} onChange={setCustomerWallet} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="product-name" className="mb-2 block text-gray-600 dark:text-gray-300">
                Product Name
                <span className="text-xl text-red-500 dark:text-red-400">*</span>
              </label>
              <input
                {...register("name")}
                type="text"
                autoComplete="text"
                className="peer block w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2 text-gray-200 transition-shadow duration-300 invalid:ring-2 invalid:ring-red-400 focus:ring-2 dark:border-gray-700"
                placeholder="Product Name"
              />
            </div>
            <div>
              <label htmlFor="description" className="mb-2 block text-gray-600 dark:text-gray-300">
                Description
                <span className="text-xl text-red-500 dark:text-red-400">*</span>
              </label>
              <input
                {...register("description", { required: true, maxLength: 500 })}
                type="text"
                autoComplete="text"
                className="peer block w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2 text-gray-200 transition-shadow duration-300 invalid:ring-2 invalid:ring-red-400 focus:ring-2 dark:border-gray-700"
                placeholder="Description"
              />
            </div>
          </div>
          <div>
            <label htmlFor="product-image" className="mb-2 block text-gray-600 dark:text-gray-300">
              Image URL
              <span className="text-xl text-red-500 dark:text-red-400">*</span>
            </label>
            <input
              {...register("image")}
              type="text"
              autoComplete="text"
              className="peer block w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2 text-gray-200 transition-shadow duration-300 invalid:ring-2 invalid:ring-red-400 focus:ring-2 dark:border-gray-700"
              placeholder="Image URL"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="description" className="mb-2 block text-gray-600 dark:text-gray-300">
                Model
                <span className="text-xl text-red-500 dark:text-red-400">*</span>
              </label>

              <input
                {...register("model", { required: true, maxLength: 20 })}
                type="text"
                autoComplete="text"
                className="peer block w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2 text-gray-200 transition-shadow duration-300 invalid:ring-2 invalid:ring-red-400 focus:ring-2 dark:border-gray-700"
                placeholder="Model"
              />
            </div>

            <div>
              <label htmlFor="description" className="mb-2 block text-gray-600 dark:text-gray-300">
                Serial Number
                <span className="text-xl text-red-500 dark:text-red-400">*</span>
              </label>
              <input
                {...register("serial_number", { required: true, maxLength: 500 })}
                type="text"
                autoComplete="text"
                className="peer block w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2 text-gray-200 transition-shadow duration-300 invalid:ring-2 invalid:ring-red-400 focus:ring-2 dark:border-gray-700"
                placeholder="Serial Number"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="description" className="mb-2 block text-gray-600 dark:text-gray-300">
                Purchase Date
                <span className="text-xl text-red-500 dark:text-red-400">*</span>
              </label>

              <input
                {...register("purchase_date", { required: true, maxLength: 20 })}
                type="text"
                autoComplete="text"
                className="peer block w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2 text-gray-200 transition-shadow duration-300 invalid:ring-2 invalid:ring-red-400 focus:ring-2 dark:border-gray-700"
                placeholder="Purchase Date"
              />
            </div>

            <div>
              <label htmlFor="description" className="mb-2 block text-gray-600 dark:text-gray-300">
                Warranty Expiry
                <span className="text-xl text-red-500 dark:text-red-400">*</span>
              </label>
              <input
                {...register("warranty_expiry", { required: true, maxLength: 20 })}
                type="text"
                autoComplete="text"
                className="peer block w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2 text-gray-200 transition-shadow duration-300 invalid:ring-2 invalid:ring-red-400 focus:ring-2 dark:border-gray-700"
                placeholder="Warranty Expiry"
              />
            </div>
          </div>
        </div>

        <Modal.Action
          actions={[
            {
              title: isLoading ? "Minting..." : "Mint",
              type: "submit",
            },
          ]}
        />
      </form>
    </Modal>
  );
};

export default MintToken;
