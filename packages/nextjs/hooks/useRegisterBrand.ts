import { useEffect, useState } from "react";
import { useScaffoldContractWrite, useScaffoldEventSubscriber } from "./scaffold-eth";

export const useRegisterBrand = (brandAddress: string) => {
  const [brandId, setBrandId] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const { writeAsync, isError, error } = useScaffoldContractWrite({
    contractName: "TrueToken",
    functionName: "registerBrand",
    args: [brandAddress],
  });

  useEffect(() => {
    if (isError) {
      setIsLoading(false);
    }
  }, [isError]);

  useScaffoldEventSubscriber({
    contractName: "TrueToken",
    eventName: "BrandRegistered",
    listener: (...[address, brandId]) => {
      if (address === brandAddress) {
        setIsLoading(false);
        setBrandId(brandId.toNumber());
      }
    },
    once: true,
  });

  return {
    register: async () => {
      setIsLoading(true);
      await writeAsync();
    },
    brandId,
    error,
    isError,
    isLoading,
  };
};
