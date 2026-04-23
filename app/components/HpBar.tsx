interface Props {
  hp: number;
  max: number;
  colorClass: string;
}

export const HpBar = ({ hp, max, colorClass }: Props) => {
  const percent = (hp / max) * 100;

  return (
    <div className="h-4 bg-[#BBBBBB] mt-4 ">
      <div
        className={colorClass + " h-full rounded-xs"}
        style={{ width: `${percent}%` }}
      />
      <div className="text-center font-girassol text-base">{hp}</div>
    </div>
  );
};
