interface Props {
  hp: number;
  max: number;
  colorClass: string;
}

export const HpBar = ({ hp, max, colorClass }: Props) => {
  const percent = (hp / max) * 100;

  return (
    <div className="h-4 bg-gray-800 ">
      <div
        className={colorClass + " h-full rounded-xs"}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};
