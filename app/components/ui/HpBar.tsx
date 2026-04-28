interface Props {
  hp: number;
  max: number;
  colorClass: string;
}

export const HpBar = ({ hp, max, colorClass }: Props) => {
  const percent = (hp / max) * 100;

  return (
    <>
      <div className="h-5 min-w-75  bg-none border-[0.2px] border-[#CECECE]/50 rounded-xs  w-full ">
        <div
          className={colorClass + " h-full rounded-xs"}
          style={{ width: `${percent}%` }}
        />
      </div>
    </>
  );
};
