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
      <p className="text-4xl font-girassol text-[#b27eec]">Victory!</p>
      <div className="flex flex-col gap-5">
        {" "}
        <p className="text-xl text-[#f4f4f4]">
          <span className="mr-2 font-bold text-2xl">Score:</span> {score} out of
          10
        </p>
        <p className="text-base text-[#f4f4f4]">
          <span className="mr-2 font-bold text-base">Highlight:</span> {detail}
        </p>
        <p className="text-base text-[#f4f4f4]">
          <span className="mr-2 font-bold text-base">Title: </span> {title}
        </p>
      </div>
      <div className="flex flex-col items-center justify-center gap-10">
        <button
          onClick={onRestart}
          className="bg-[#969E90] text-black rounded-xs px-6 py-2 w-40 font-girassol"
        >
          Restart
        </button>

        <a
          href="https://www.linkedin.com/in/juliansandstrom"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white border-[0.3px] border-white/20 rounded-xs px-6 py-2 inline-block text-center w-40 "
        >
          Contact developer
        </a>
      </div>
    </div>
  );
};

export default VictoryScreen;
