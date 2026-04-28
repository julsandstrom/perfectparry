import { HpBar } from "../ui/HpBar";

interface HpbarProps {
  enemyHp: number;
}

const HpBars = ({ enemyHp }: HpbarProps) => {
  return (
    <div className="w-full   px-4   text-white tracking-wide">
      <div className="flex flex-col items-end w-full mt-4 ">
        {" "}
        <span className="w-full text-left text-sm ">Confused Skeleton</span>
        <div className="w-full self-center">
          <HpBar hp={enemyHp} max={30} colorClass="bg-[#D23B3B]" />
        </div>
        <span className="text-end text-base ">{enemyHp}hp</span>
      </div>
    </div>
  );
};

export default HpBars;
