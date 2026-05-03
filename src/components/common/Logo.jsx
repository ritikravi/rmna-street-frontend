/**
 * RMNA Street Logo Component
 * Brand colors: #000000, #FFFFFF, #BB0000
 * Tagline: BUILT DIFFERENT
 */

export default function Logo({ variant = 'dark', size = 'md', showTagline = false, className = '' }) {
  const textColor = variant === 'light' ? '#FFFFFF' : '#000000';

  const sizes = {
    sm: { width: 90, height: 24 },
    md: { width: 130, height: 34 },
    lg: { width: 200, height: 52 },
    xl: { width: 280, height: 72 },
  };

  const { width, height } = sizes[size] || sizes.md;

  return (
    <div className={`inline-flex flex-col items-start gap-0.5 ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 260 68"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="RMNA Street"
        role="img"
      >
        {/* R */}
        <path
          d="M4 8H4V60H14V42H26L35 60H47L37 40C42 37.5 46 32 46 24C46 14.5 39 8 28 8H4ZM14 17H27C32 17 36 20 36 24C36 28 32 32 27 32H14V17Z"
          fill={textColor}
        />
        {/* Red accent on R leg */}
        <path d="M36 32L46 32L41 42Z" fill="#BB0000" />

        {/* M */}
        <path
          d="M55 8V60H65V28L78 50L91 28V60H101V8H91L78 32L65 8H55Z"
          fill={textColor}
        />

        {/* N */}
        <path
          d="M110 8V60H120V28L143 60H153V8H143V40L120 8H110Z"
          fill={textColor}
        />

        {/* A */}
        <path
          d="M162 60L176 8H188L202 60H192L189 46H175L172 60H162ZM177 37H187L182 18L177 37Z"
          fill={textColor}
        />
        {/* Red accent on A bottom-right */}
        <path d="M189 46L202 60H192Z" fill="#BB0000" />
      </svg>

      {showTagline && (
        <div className="flex items-center gap-1.5" style={{ paddingLeft: 2 }}>
          <span style={{ width: 16, height: 1, background: '#BB0000', display: 'inline-block' }} />
          <span
            style={{
              color: variant === 'light' ? '#FFFFFF' : '#000000',
              fontSize: size === 'sm' ? 7 : size === 'lg' || size === 'xl' ? 11 : 9,
              letterSpacing: '0.25em',
              fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              textTransform: 'uppercase',
            }}
          >
            Built Different
          </span>
          <span style={{ width: 16, height: 1, background: '#BB0000', display: 'inline-block' }} />
        </div>
      )}
    </div>
  );
}
