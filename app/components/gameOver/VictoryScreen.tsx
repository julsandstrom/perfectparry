const VictoryScreen = () => {
  return (
    <div>
      <p className="text-4xl mb-10">You win!</p>

      <div className="flex gap-5">
        {" "}
        <button>Restart</button>
        <button>Home</button>
      </div>
    </div>
  );
};

export default VictoryScreen;
