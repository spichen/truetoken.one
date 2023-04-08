export const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0  w-screen border-t border-gray-100 pt-8 pb-8 dark:border-gray-800">
      <div className="m-auto space-y-8 px-4 text-gray-600 dark:text-gray-400 sm:px-12 xl:max-w-6xl xl:px-0">
        <div className="flex justify-center text-sm">
          <div>
            Built with 🏰{" "}
            <a href="https://buidlguidl.com/" target="_blank" rel="noreferrer" className="underline underline-offset-2">
              Scafdold-eth 2
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
