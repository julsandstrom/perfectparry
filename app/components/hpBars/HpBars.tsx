import { HpBar } from "../ui/HpBar";

interface HpbarProps {
  enemyHp: number;
  playerHp: number;
}

const HpBars = ({ enemyHp, playerHp }: HpbarProps) => {
  return (
    <div className="grid grid-cols-2 gap-20">
      <div className="flex flex-col">
        <span className="w-full text-left text-sm font-girassol">You</span>
        <div className="w-full justify-center">
          <HpBar hp={playerHp} max={25} colorClass="bg-[#FF2020]" />
          <span className="text-base ">{playerHp}hp</span>
        </div>
      </div>
      <div className="  flex flex-col">
        <span className="w-full text-left text-sm font-girassol">Skeleton</span>
        <div className="w-full justify-center">
          <HpBar hp={enemyHp} max={30} colorClass="bg-[#FF2020]" />
          <span className=" text-base ">{enemyHp}hp</span>
        </div>
      </div>
    </div>
  );
};

export default HpBars;
