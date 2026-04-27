import { HpBar } from "../ui/HpBar";

interface HpbarProps {
  playerHp: number;
  enemyHp: number;
}

const HpBars = ({ playerHp, enemyHp }: HpbarProps) => {
  return (
    <div className="w-full grid grid-cols-2 gap-20 px-4  text-[#0F0F0F] tracking-wide">
      <div className="flex flex-col items-start w-full mt-4">
        <span className="text-start text-base">{playerHp}hp</span>
        <HpBar hp={playerHp} max={20} colorClass="bg-[#D23B3B]" />
        <span className="w-full text-center text-sm -mb-2">You</span>
      </div>
      <div className="flex flex-col items-end w-full mt-4 ">
        {" "}
        <span className="text-end text-base ">{enemyHp}hp</span>
        <div className="w-full scale-x-[-1]">
          <HpBar hp={enemyHp} max={30} colorClass="bg-[#D23B3B]" />
        </div>
        <span className="w-full text-center text-sm -mb-2">
          Confused Skeleton
        </span>
      </div>
    </div>
  );
};

export default HpBars;
