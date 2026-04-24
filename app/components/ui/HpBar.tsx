interface Props {
  hp: number;
  max: number;
  colorClass: string;
}

export const HpBar = ({ hp, max, colorClass }: Props) => {
  const percent = (hp / max) * 100;

  return (
    <div className="h-4 bg-[#F1E2D5]  w-full mt-2">
      <div
        className={colorClass + " h-full rounded-xs"}
        style={{ width: `${percent}%` }}
      />
      <div className="text-center text-base">{hp}</div>
    </div>
  );
};
