export const DefeatScreen = ({ onRestart }: { onRestart: () => void }) => {
  return (
    <div className="h-full w-full flex flex-col gap-10 items-center justify-center">
      <p className="text-4xl font-girassol">You died...</p>
      <div className="flex flex-col items-center justify-center gap-10">
        <button
          onClick={onRestart}
          className="bg-white text-black rounded-xs px-6 py-2"
        >
          Try Again
        </button>
        <a
          href="https://www.linkedin.com/in/juliansandstrom"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white border-[0.3px] rounded-xs px-6 py-2 inline-block text-center"
        >
          Contact developer
        </a>
      </div>
    </div>
  );
};
