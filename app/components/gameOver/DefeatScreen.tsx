export const DefeatScreen = ({ onRestart }: { onRestart: () => void }) => {
  return (
    <div className="h-full w-full flex flex-col gap-10 lg:gap-20 items-center justify-center">
      <p className="text-4xl lg:text-6xl font-girassol">You died...</p>
      <div className="flex flex-col items-center justify-center gap-10 lg:gap-14">
        <button
          onClick={onRestart}
          className="bg-[#325298] lg:text-xl text-[#F1F1F1] rounded-sm px-6 py-2 w-40 lg:w-60 lg:py-4"
        >
          Try Again
        </button>
        <a
          href="https://www.linkedin.com/in/juliansandstrom"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white border-[0.3px] lg:text-xl border-white/20 rounded-sm px-6 py-2 lg:w-60 lg:py-4 inline-block text-center w-40"
        >
          Contact developer
        </a>
      </div>
    </div>
  );
};
