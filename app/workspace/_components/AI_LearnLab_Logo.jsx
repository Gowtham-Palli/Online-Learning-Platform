const AI_LearnLab_Logo = ({ width = 200, height = 60 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 200 60"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="AI LearnLab logo"
  >
    {/* Brain + Book Icon */}
    <g>
      {/* Brain outline */}
      <circle cx="30" cy="30" r="20" fill="#4A90E2" />
      {/* Brain lines */}
      <path
        d="M30 15 L30 45 M15 30 L45 30 M20 20 L40 40 M40 20 L20 40"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Book base */}
      <rect x="18" y="45" width="24" height="8" fill="#2F80ED" rx="2" />
    </g>

    {/* Logo Text */}
    <text
      x="70"
      y="38"
      fontFamily="Segoe UI, Tahoma, Geneva, Verdana, sans-serif"
      fontSize="22"
      fill="white"
      fontWeight="600"
    >
      AI LearnLab
    </text>
  </svg>
);
export default AI_LearnLab_Logo