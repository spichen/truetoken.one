import { useEffect, useState } from "react";
import { useRegisterBrand } from "~~/hooks";

type Props = {
  address: string;
  onSuccess: (brandId: number) => void;
};

const RegisterBrand = ({ address, onSuccess }: Props) => {
  const [name, setName] = useState<string>("");
  const { register, brandId, isLoading, isError, error } = useRegisterBrand(address);

  useEffect(() => {
    if (brandId) onSuccess(brandId);
  }, [brandId, onSuccess]);

  if (isError) console.log(error?.message);

  return (
    <div>
      {brandId ? (
        <div>Brand ID: {brandId}</div>
      ) : (
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">Register your brand</h2>

          <div className="mt-8 space-y-6">
            <input type="hidden" name="remember" value="true" />
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="business-name" className="sr-only">
                  Business Name
                </label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  id="business-name"
                  name="business-name"
                  type="text"
                  autoComplete="text"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Business Name"
                />
              </div>
            </div>
            <div>
              <button
                disabled={isLoading}
                onClick={register}
                type="submit"
                className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {isLoading ? "Registering..." : "Register"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterBrand;
