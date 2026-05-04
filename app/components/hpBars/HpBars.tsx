import { HpBar } from "../ui/HpBar";

interface HpbarProps {
  enemyHp: number;
  playerHp: number;
}

const HpBars = ({ enemyHp, playerHp }: HpbarProps) => {
  return (
    <div className="flex flex-row justify-between items-start w-full px-4">
      <div className="flex flex-col">
        <span className="text-sm font-girassol xl:text-xl">You</span>
        <HpBar hp={playerHp} max={25} colorClass="bg-[#FF2020]" />
        <span className="text-base xl:text-xl">{playerHp}hp</span>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-sm font-girassol xl:text-xl">Skeleton</span>
        <HpBar hp={enemyHp} max={30} colorClass="bg-[#FF2020]" />
        <span className="text-base xl:text-xl">{enemyHp}hp</span>
      </div>
    </div>
  );
};

export default HpBars;
