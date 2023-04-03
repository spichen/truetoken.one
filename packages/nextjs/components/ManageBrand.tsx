type Props = {
  brandId: number;
};

const ManageBrand = ({ brandId }: Props) => {
  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Brand {brandId}</h1>
        </div>
      </header>
    </>
  );
};

export default ManageBrand;
