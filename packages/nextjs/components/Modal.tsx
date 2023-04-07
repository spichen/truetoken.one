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
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">{title}</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => onRequestClose()}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                {children}
                {/*footer*/}
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
    <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
      {actions.map(action => {
        return (
          <button
            key={action.title}
            className="btn btn-primary"
            type={action?.type || "button"}
            onClick={() => action.onClick?.()}
          >
            {action.title}
          </button>
        );
      })}
    </div>
  );
};

Modal.Action = ModalAction;
