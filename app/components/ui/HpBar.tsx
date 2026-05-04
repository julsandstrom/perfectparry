interface Props {
  hp: number;
  max: number;
  colorClass: string;
}

export const HpBar = ({ hp, max, colorClass }: Props) => {
  const percent = (hp / max) * 100;

  return (
    <>
      <div className="h-3 max-w-24 sm:max-w-32 md:sm:max-w-44 xl:sm:max-w-52 2xl:sm:max-w-72 sm:h-5 xl:h-7   bg-none border-[0.3px] border-[#CECECE]/50 rounded-xs  w-full ">
        <div
          className={colorClass + " h-full rounded-xs"}
          style={{ width: `${percent}%` }}
        />
      </div>
    </>
  );
};
