import { HpBar } from "../ui/HpBar";

interface HpbarProps {
  enemyHp: number;
}

const HpBars = ({ enemyHp }: HpbarProps) => {
  return (
    <div className="  ">
      <div className="flex justify-between w-full mt-4">
        <span className="w-full text-left text-sm font-girassol">Skeleton</span>
        <span className="text-end text-base ">{enemyHp}hp</span>
      </div>
      <div className="w-full justify-center">
        <HpBar hp={enemyHp} max={30} colorClass="bg-[#FF2020]" />
      </div>
    </div>
  );
};

export default HpBars;
