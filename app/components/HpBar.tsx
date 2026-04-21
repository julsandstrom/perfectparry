interface Props {
  hp: number;
  max: number;
  colorClass: string;
}

export const HpBar = ({ hp, max, colorClass }: Props) => {
  const percent = (hp / max) * 100;

  return (
    <div className="h-4 bg-gray-800 rounded">
      <div
        className={colorClass + " h-full rounded"}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};
