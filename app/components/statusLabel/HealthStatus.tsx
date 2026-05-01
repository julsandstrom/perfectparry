interface PlayerStatus {
  playerStatus: string | null;
}

const HealthStatus = ({ playerStatus }: PlayerStatus) => {
  return (
    <div className="flex justify-center pl-3 pb-1">
      {playerStatus === "healthy" && (
        <p className="text-base text-[#0BBA0E]">~ Feeling Great ~</p>
      )}{" "}
      {playerStatus === "low" && (
        <p className="text-base  text-[#FFB520]">~ Careful ~</p>
      )}
      {playerStatus === "critical" && (
        <p className="text-base font-bold text-[#FF2020]">~ Danger ~</p>
      )}
    </div>
  );
};

export default HealthStatus;
