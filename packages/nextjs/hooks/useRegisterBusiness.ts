import { useEffect, useState } from "react";
import { useScaffoldContractWrite, useScaffoldEventSubscriber } from "./scaffold-eth";

export const useRegisterBusiness = (businessAccount: string, businessName: string) => {
  const [businessId, setBusinessId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const { writeAsync, isError, error } = useScaffoldContractWrite({
    contractName: "TrueToken",
    functionName: "registerBusiness",
    args: [businessAccount, businessName],
  });

  useEffect(() => {
    if (isError) {
      setIsLoading(false);
    }
  }, [isError]);

  useScaffoldEventSubscriber({
    contractName: "TrueToken",
    eventName: "BusinessRegistered",
    listener: (...[address, businessId]) => {
      if (address === businessAccount) {
        setIsLoading(false);
        setBusinessId(businessId._hex);
      }
    },
    once: true,
  });

  return {
    register: async () => {
      setIsLoading(true);
      await writeAsync();
    },
    businessId,
    error,
    isError,
    isLoading,
  };
};
