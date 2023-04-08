import { XMarkIcon } from "@heroicons/react/24/outline";

export default function Modal({
  open,
  onRequestClose,
  children,
  title,
}: {
  open: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <>
      {open ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl shadow-gray-600/10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none sm:col-span-2 sm:px-12 lg:col-span-1 lg:row-span-2">
              <div className="relative">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{title}</h2>
                  <button
                    onClick={onRequestClose}
                    className="group relative flex h-10 w-10 items-center justify-center before:absolute before:inset-0 before:rounded-full before:border before:border-gray-200 before:bg-gray-50 before:bg-gradient-to-b before:transition-transform before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 dark:before:border-gray-700 dark:before:bg-gray-800"
                  >
                    <XMarkIcon className="h-5 w-5 z-10 text-gray-500" />
                  </button>
                </div>
                <div>{children}</div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}

const ModalAction = ({
  actions,
}: {
  actions: { title: string; type?: "button" | "submit" | "reset"; onClick?: () => void }[];
}) => {
  return (
    <div className="flex item-right mt-8">
      {actions.map(action => {
        return (
          <button
            key={action.title}
            className="relative ml-auto flex h-11 w-max items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition-transform before:duration-300 active:duration-75 active:before:scale-95 dark:before:bg-primaryLight"
            type={action?.type || "button"}
            onClick={() => action.onClick?.()}
          >
            <span className="relative text-base font-semibold text-white dark:text-gray-900">{action.title}</span>
          </button>
        );
      })}
    </div>
  );
};

Modal.Action = ModalAction;
