import { useEffect, useState } from "react";
import { BuildingLibraryIcon } from "@heroicons/react/24/outline";
import { useRegisterBusiness } from "~~/hooks";

type Props = {
  address: string;
  onSuccess: (businessId: string) => void;
};

const RegisterBusiness = ({ address, onSuccess }: Props) => {
  const [businessName, setBusinessName] = useState<string>("");
  const { register, businessId, isLoading } = useRegisterBusiness(address, businessName);

  useEffect(() => {
    if (businessId) onSuccess(businessId);
  }, [businessId, onSuccess]);

  return (
    <form action="" className="mt-12">
      <div className="relative flex items-center rounded-full border border-primary/20 bg-white p-1 px-2 shadow-md focus-within:ring-2 dark:border-white/10 dark:bg-dark md:p-2 lg:pr-3">
        <div className="py-3 pl-4 lg:pl-5">
          <BuildingLibraryIcon className="h-4 w-4 text-white" />
        </div>
        <input
          value={businessName}
          onChange={e => setBusinessName(e.target.value)}
          aria-label="business-name"
          placeholder="Your company name"
          className="w-full rounded-full bg-transparent p-4 placeholder-gray-600 outline-none dark:text-white dark:placeholder-white"
          type="email"
        />
        <div className="md:pr-1.5 lg:pr-0">
          <button
            disabled={isLoading}
            onClick={register}
            type="button"
            title="Register"
            className="relative ml-auto h-12 w-16 before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition before:duration-300 active:duration-75 active:before:scale-95 dark:before:bg-primaryLight sm:w-auto sm:px-6"
          >
            <span className="relative hidden w-max font-semibold text-white dark:text-gray-900 md:block">
              {" "}
              {isLoading ? "In progress..." : "Register"}{" "}
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
        </div>
      </div>
    </form>
  );
};

export default RegisterBusiness;
