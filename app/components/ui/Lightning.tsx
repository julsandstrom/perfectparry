const Lightning = () => {
  return (
    <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 animate-lightning-flash bg-indigo-200/60" />
      <svg
        className="absolute inset-0 w-full h-full animate-lightning-flash"
        viewBox="0 0 400 800"
        preserveAspectRatio="xMidYMin meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          style={{
            filter:
              "drop-shadow(0 0 8px #c4baff) drop-shadow(0 0 20px #9080ff)",
          }}
        >
          <polyline
            points="210,0 195,80 212,80 190,170 208,170 180,290"
            stroke="#e0dcff"
            strokeWidth="2.5"
            fill="none"
          />
          <polyline
            points="210,0 195,80 212,80 190,170 208,170 180,290"
            stroke="white"
            strokeWidth="0.8"
            fill="none"
          />
        </g>
        <g style={{ filter: "drop-shadow(0 0 5px #b8aaff)" }}>
          <polyline
            points="300,0 286,60 300,60 275,130 290,130 260,230"
            stroke="#c8c2ff"
            strokeWidth="1.5"
            fill="none"
          />
        </g>
      </svg>
    </div>
  );
};

export default Lightning;
