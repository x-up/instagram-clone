export default function BackIcon({ size = 24, color = 'currentColor' }) {
    return (
      <svg
        aria-label="Back"
        fill={color}
        height={size}
        role="img"
        viewBox="0 0 24 24"
        width={size}
      >
        <title>Back</title>
        <line
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          x1="2.909"
          x2="22.001"
          y1="12.004"
          y2="12.004"
        ></line>
        <polyline
          fill="none"
          points="9.276 4.726 2.001 12.004 9.276 19.274"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        ></polyline>
      </svg>
    );
  }
  