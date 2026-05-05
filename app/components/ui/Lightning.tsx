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
        <defs>
          <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="4"
              floodColor="#c4baff"
              floodOpacity="1"
            />
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="10"
              floodColor="#9080ff"
              floodOpacity="0.8"
            />
          </filter>
          <filter id="glow-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="3"
              floodColor="#b8aaff"
              floodOpacity="0.9"
            />
          </filter>
        </defs>

        <g filter="url(#glow-strong)">
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

        <g filter="url(#glow-soft)">
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
