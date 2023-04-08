import { useEffect } from "react";
import { useRegisterBrand } from "~~/hooks";

type Props = {
  address: string;
  onSuccess: (brandId: string) => void;
};

const RegisterBrand = ({ address, onSuccess }: Props) => {
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
          <h2 className="mt-6 text-3xl font-bold">Register your brand</h2>
          <div className="form-control w-full max-w-xs mt-5">
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-full">
                <label htmlFor="business-name" className="label">
                  <span className="label-text">Business Name</span>
                </label>

                <input
                  id="business-name"
                  name="business-name"
                  type="text"
                  autoComplete="text"
                  required
                  className="input w-full max-w-xs input-bordered"
                  placeholder="Business Name"
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="country" className="label">
                  <span className="label-text">Country</span>
                </label>
                <select
                  id="country"
                  name="country"
                  autoComplete="country-name"
                  className="select w-full max-w-xs input-bordered"
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>Mexico</option>
                </select>
              </div>
            </div>
            <div className="mt-10">
              <button disabled={isLoading} onClick={register} type="submit" className="btn btn-primary btn-block">
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
