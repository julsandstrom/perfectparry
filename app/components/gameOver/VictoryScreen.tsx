import { calcScore, calcTitle } from "@/app/lib/combatScore";
import { CombatStats } from "@/app/types";

const VictoryScreen = ({
  onRestart,
  stats,
}: {
  onRestart: () => void;
  stats: CombatStats;
}) => {
  const score = calcScore(stats);
  const { title, detail } = calcTitle(stats);
  return (
    <div className="h-full w-full flex flex-col gap-10 items-center justify-center">
      <p className="text-4xl lg:text-6xl font-girassol text-[#456bbe]">
        Victory!
      </p>
      <div className="flex flex-col gap-5">
        {" "}
        <p className="text-xl lg:text-2xl text-[#f4f4f4]">
          <span className="mr-2 font-bold text-2xl lg:text-4xl">Score:</span>{" "}
          {score} out of 10
        </p>
        <p className="text-base text-[#f4f4f4] lg:text-2xl">
          <span className="mr-2 font-bold text-base lg:text-4xl">
            Highlight:
          </span>{" "}
          {detail}
        </p>
        <p className="text-base text-[#f4f4f4] lg:text-2xl">
          <span className="mr-2 font-bold text-base lg:text-4xl">Title: </span>{" "}
          {title}
        </p>
      </div>
      <div className="flex flex-col items-center justify-center gap-10">
        <button
          onClick={onRestart}
          className="bg-[#325298] text-[#F1F1F1] rounded-xs px-6 py-2 w-40 font-girassol lg:text-xl lg:w-60 lg:py-4"
        >
          Restart
        </button>

        <a
          href="https://www.linkedin.com/in/juliansandstrom"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white border-[0.3px] border-white/20 rounded-xs px-6 py-2 inline-block lg:w-60 lg:py-4 text-center w-40 lg:text-xl"
        >
          Contact developer
        </a>
      </div>
    </div>
  );
};

export default VictoryScreen;
