import { useEffect, useState } from "react";
import { AddressInput } from "./scaffold-eth";
import { NFTStorage } from "nft.storage";
import { SubmitHandler, useForm } from "react-hook-form";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import config from "~~/truetoken.config.js";

type MintTokenForm = {
  to: string;
  name: string;
  description: string;
  model: string;
  serial_number: string;
  purchase_date: string;
  warranty_expiry_date: string;
};

const MintToken = () => {
  const [customerWallet, setCustomerWallet] = useState<string>("");
  const { register, handleSubmit, reset } = useForm<MintTokenForm>();
  const [metadataURI, setMetadataURI] = useState<string | undefined>(undefined);

  const { writeAsync } = useScaffoldContractWrite({
    contractName: "TrueToken",
    functionName: "mint",
    args: [customerWallet, metadataURI],
  });

  async function getExampleImage() {
    const imageOriginUrl =
      "https://fastly.picsum.photos/id/249/200/300.jpg?hmac=HXJz3fKmXquFNHrfyd1yRHUYx9SheA_j2gbbya_4mlA";
    const r = await fetch(imageOriginUrl);
    if (!r.ok) {
      throw new Error(`error fetching image: ${r.status}`);
    }
    return r.blob();
  }
  const client = new NFTStorage({ token: config.nftStorageApiKey });

  const onSubmit: SubmitHandler<MintTokenForm> = async data => {
    const image = await getExampleImage();

    const metadata = await client.store({
      name: data.name,
      description: data.description,
      image,
      properties: {
        model: data.model,
        serial_number: data.serial_number,
        purchase_date: data.purchase_date,
        warranty_expiry_date: data.warranty_expiry_date,
      },
    });

    setMetadataURI(metadata.url);
  };

  useEffect(() => {
    if (metadataURI) {
      writeAsync();
      setCustomerWallet("");
      reset();
    }
  }, [metadataURI]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Mint Token</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">Issue new token for your customer.</p>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-full">
              <div>
                <label htmlFor="product-name" className="block text-sm font-medium leading-6 text-gray-900">
                  Customer Wallet
                </label>
                <AddressInput value={customerWallet} onChange={setCustomerWallet} />
              </div>
            </div>
            <div className="col-span-full ">
              <div>
                <label htmlFor="product-name" className="block text-sm font-medium leading-6 text-gray-900">
                  Product Name
                </label>
                <div className="flex border-2 border-base-300 bg-base-200 rounded-full text-accent">
                  <input
                    {...register("name")}
                    type="text"
                    autoComplete="text"
                    className="input input-ghost focus:outline-none focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-accent/50 text-gray-400"
                    placeholder="Product Name"
                  />
                </div>
              </div>
            </div>
            <div className="col-span-full">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                    Description
                  </label>
                  <div className="flex border-2 border-base-300 bg-base-200 rounded-full text-accent">
                    <input
                      {...register("description", { required: true, maxLength: 20 })}
                      type="text"
                      autoComplete="text"
                      required
                      className="input input-ghost focus:outline-none focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-accent/50 text-gray-400"
                      placeholder="Description"
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="sm:col-span-3">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <label htmlFor="model" className="block text-sm font-medium leading-6 text-gray-900">
                    Model
                  </label>

                  <div className="flex border-2 border-base-300 bg-base-200 rounded-full text-accent">
                    <input
                      {...register("model", { required: true, maxLength: 20 })}
                      type="text"
                      autoComplete="text"
                      required
                      className="input input-ghost focus:outline-none focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-accent/50 text-gray-400"
                      placeholder="Model"
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="sm:col-span-3">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <label htmlFor="serial_number" className="block text-sm font-medium leading-6 text-gray-900">
                    Serial Number
                  </label>
                  <div className="flex border-2 border-base-300 bg-base-200 rounded-full text-accent">
                    <input
                      {...register("serial_number", { required: true, maxLength: 20 })}
                      type="text"
                      autoComplete="text"
                      required
                      className="input input-ghost focus:outline-none focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-accent/50 text-gray-400"
                      placeholder="Serial Number"
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="sm:col-span-3">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <label htmlFor="purchase_date" className="block text-sm font-medium leading-6 text-gray-900">
                    Purchase Date
                  </label>
                  <div className="flex border-2 border-base-300 bg-base-200 rounded-full text-accent">
                    <input
                      {...register("purchase_date", { required: true, maxLength: 20 })}
                      type="text"
                      autoComplete="text"
                      required
                      className="input input-ghost focus:outline-none focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-accent/50 text-gray-400"
                      placeholder="Purchase Date"
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="sm:col-span-3">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <label htmlFor="warranty_expiry_date" className="block text-sm font-medium leading-6 text-gray-900">
                    Warranty Expiry Date
                  </label>
                  <div className="flex border-2 border-base-300 bg-base-200 rounded-full text-accent">
                    <input
                      {...register("warranty_expiry_date", { required: true, maxLength: 20 })}
                      type="text"
                      autoComplete="text"
                      required
                      className="input input-ghost focus:outline-none focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-accent/50 text-gray-400"
                      placeholder="Warranty Expiry Date"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
          onClick={() => {
            setCustomerWallet("");
            reset();
          }}
        >
          Reset
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Mint
        </button>
      </div>
    </form>
  );
};

export default MintToken;
