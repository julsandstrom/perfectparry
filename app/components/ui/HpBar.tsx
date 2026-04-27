interface Props {
  hp: number;
  max: number;
  colorClass: string;
}

export const HpBar = ({ hp, max, colorClass }: Props) => {
  const percent = (hp / max) * 100;

  return (
    <>
      <div className="h-4 bg-none border-[0.3px] border-[#1F1F1F] rounded-xs  w-full ">
        <div
          className={colorClass + " h-full rounded-xs"}
          style={{ width: `${percent}%` }}
        />
      </div>
    </>
  );
};
